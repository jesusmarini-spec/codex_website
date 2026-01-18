import ky from 'ky';
import dayjs from 'dayjs';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const POSTS_ENDPOINT = '/data/posts.json';
const INSTAGRAM_ENDPOINT = '/data/instagram.json';
const LINKEDIN_ENDPOINT = '/data/linkedin.json';

const state = {
  posts: [],
  filter: 'all'
};

const postListEl = document.querySelector('#blog-post-list');
const chipButtons = document.querySelectorAll('.blog-chip');
const instagramEl = document.querySelector('#instagram-feed');
const linkedinEl = document.querySelector('#linkedin-feed');

const formatDate = (value) => dayjs(value).format('MMM D, YYYY');

const sanitizeMarkdown = (value = '') => {
  const raw = marked.parse(value, { mangle: false, headerIds: false });
  return DOMPurify.sanitize(raw);
};

const fallbackMessage = (container, message) => {
  container.innerHTML = `<div class="social-card"><p>${message}</p></div>`;
};

const createPostCard = (post) => {
  const articleLink = `/blog/article.html?id=${encodeURIComponent(post.id)}`;
  const wrapper = document.createElement('article');
  wrapper.className = 'blog-card';
  wrapper.innerHTML = `
    <img src="${post.heroImage}" alt="${post.heroAlt || post.title}" class="blog-card__image">
    <div class="blog-card__body">
      <div class="blog-card__meta">${formatDate(post.date)} • ${post.readTime} min read</div>
      <h3>${post.title}</h3>
      <div class="blog-card__tags">
        ${post.tags.map((tag) => `<span>#${tag}</span>`).join('')}
      </div>
      <div class="blog-card__excerpt">${sanitizeMarkdown(post.excerpt)}</div>
      <div class="blog-card__cta">
        <a class="btn" href="${articleLink}" aria-label="Open article ${post.title}">Read article</a>
      </div>
    </div>
  `;
  return wrapper;
};

const renderPosts = () => {
  if (!state.posts.length) {
    postListEl.innerHTML = '<div class="blog-empty-state"><p>No entries yet—check back after the next sprint.</p></div>';
    return;
  }

  const visible = state.filter === 'all'
    ? state.posts
    : state.posts.filter((post) => post.tags.includes(state.filter));

  if (!visible.length) {
    postListEl.innerHTML = `<div class="blog-empty-state"><p>No posts tagged with <strong>${state.filter}</strong> yet.</p></div>`;
    return;
  }

  postListEl.innerHTML = '';
  visible.forEach((post) => postListEl.appendChild(createPostCard(post)));
};

const handleFilterClick = (event) => {
  const target = event.currentTarget;
  const tag = target.dataset.tag;
  if (!tag) return;
  state.filter = tag;
  chipButtons.forEach((btn) => btn.classList.toggle('blog-chip--active', btn.dataset.tag === tag));
  renderPosts();
};

const attachFilters = () => {
  chipButtons.forEach((btn) => btn.addEventListener('click', handleFilterClick));
};

const renderInstagramFeed = (items = []) => {
  if (!items.length) {
    fallbackMessage(instagramEl, 'Connect an Instagram token via the Basic Display API. Current data lives in /data/instagram.json.');
    return;
  }

  instagramEl.innerHTML = items.map((item) => `
    <article class="social-card">
      <img class="social-card__thumb" src="${item.mediaUrl}" alt="${item.caption}">
      <div class="social-card__caption">${item.caption}</div>
      <div class="social-card__meta">${formatDate(item.timestamp)}</div>
    </article>
  `).join('');
};

const renderLinkedInFeed = (items = []) => {
  if (!items.length) {
    fallbackMessage(linkedinEl, 'Drop curated LinkedIn post metadata into /data/linkedin.json after exporting from the Share API.');
    return;
  }

  linkedinEl.innerHTML = items.map((item) => `
    <article class="social-card">
      <div class="social-card__caption"><strong>${item.title}</strong></div>
      <div class="social-card__caption">${item.summary}</div>
      <div class="social-card__meta">${formatDate(item.published)}</div>
      <a class="btn btn--ghost" href="${item.url}" target="_blank" rel="noopener" aria-label="Open LinkedIn post: ${item.title}">Open post</a>
    </article>
  `).join('');
};

const loadJSON = async (url) => {
  try {
    return await ky.get(url, { cache: 'no-cache' }).json();
  } catch (error) {
    console.warn(`Failed to load ${url}`, error);
    return [];
  }
};

const init = async () => {
  attachFilters();
  state.posts = await loadJSON(POSTS_ENDPOINT);
  renderPosts();

  const [instagramItems, linkedinItems] = await Promise.all([
    loadJSON(INSTAGRAM_ENDPOINT),
    loadJSON(LINKEDIN_ENDPOINT)
  ]);

  renderInstagramFeed(instagramItems);
  renderLinkedInFeed(linkedinItems);
};

init();
