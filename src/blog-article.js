import ky from 'ky';
import dayjs from 'dayjs';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const POSTS_ENDPOINT = '/data/posts.json';
const root = document.querySelector('#article-root');

const params = new URLSearchParams(window.location.search);
const articleId = params.get('id');

const sanitizeMarkdown = (value = '') => {
  const raw = marked.parse(value, { mangle: false, headerIds: true });
  return DOMPurify.sanitize(raw);
};

const renderMessage = (message) => {
  root.innerHTML = `
    <div class="blog-empty-state">
      <p>${message}</p>
      <a class="btn article-backlink__btn" href="/blog/index.html">Back to journal</a>
    </div>
  `;
};

const buildShareLinks = (title) => {
  const currentUrl = window.location.href;
  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(title);
  return [
    {
      label: 'Share on LinkedIn',
      icon: 'fab fa-linkedin',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
    },
    {
      label: 'Share on X',
      icon: 'fab fa-x-twitter',
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`
    }
  ];
};

const renderArticle = (post) => {
  const shareLinks = buildShareLinks(post.title);

  root.innerHTML = `
    <div class="article-hero">
      <p class="section__subtitle section__subtitle--intro">Journal entry</p>
      <h1 class="section__title">${post.title}</h1>
      <div class="article-meta">
        <span>${dayjs(post.date).format('MMMM D, YYYY')}</span>
        <span>•</span>
        <span>${post.readTime} min read</span>
      </div>
      <img class="article-hero__image" src="${post.heroImage}" alt="${post.heroAlt || post.title}">
    </div>

    <div class="article-content">
      ${sanitizeMarkdown(post.content)}
    </div>

    <div class="article-tags">
      ${post.tags.map((tag) => `<span class="article-tag">${tag}</span>`).join('')}
    </div>

    <div class="article-share">
      <strong>Share</strong>
      <div class="article-share__actions">
        ${shareLinks.map((link) => `
          <a href="${link.href}" target="_blank" rel="noopener">
            <i class="${link.icon}"></i>${link.label}
          </a>
        `).join('')}
      </div>
    </div>

    <div class="article-backlink">
      <a class="btn" href="/blog/index.html">Back to journal</a>
    </div>
  `;
};

const init = async () => {
  if (!articleId) {
    renderMessage('Missing article ID. Select an entry from the blog.');
    return;
  }
  try {
    const posts = await ky.get(POSTS_ENDPOINT, { cache: 'no-cache' }).json();
    const post = posts.find((entry) => entry.id === articleId);
    if (!post) {
      renderMessage('Article not found. Try another entry.');
      return;
    }
    renderArticle(post);
  } catch (error) {
    console.error('Failed to load article data', error);
    renderMessage('Unable to load this article. Please refresh or return to the journal.');
  }
};

init();
