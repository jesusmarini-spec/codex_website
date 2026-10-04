const navToggle = document.querySelector('.nav__toggle');
const navLink = document.querySelectorAll('.nav__link');
const siteHeader = document.querySelector('header');
const mobileHomeLink = document.querySelector('.logo--mobile a');

//This is for the class---------------------------------------------------
const portfolioItems = document.querySelectorAll('.port-img')
const portfolioItems1 = document.querySelectorAll('.port-tag')
portfolioItems.forEach(portfolioItem =>{
    portfolioItem.addEventListener('mouseover', ()=>{
        portfolioItem.childNodes[3].classList.add('name_light');
        
    })
    portfolioItem.addEventListener('mouseout', ()=>{
        portfolioItem.childNodes[3].classList.remove('name_light');

    })
})

//----------------------------------------------------------------------------
navToggle?.addEventListener('click', () => {

    document.body.classList.toggle('nav__open');
    navToggle.setAttribute('aria-expanded', document.body.classList.contains('nav__open') ? 'true' : 'false');

});

mobileHomeLink?.addEventListener('click', () => {
    document.body.classList.remove('nav__open');
    navToggle?.setAttribute('aria-expanded', 'false');
});

const updateHeaderState = () => {
    siteHeader?.classList.toggle('header--scrolled', window.scrollY > 12);
};

updateHeaderState();
window.addEventListener('scroll', updateHeaderState, { passive: true });

navLink.forEach(link =>{
    link.addEventListener('click', () =>{
        document.body.classList.remove('nav__open');
        navToggle?.setAttribute('aria-expanded', 'false');
    })
})

const projectFiltersContainer = document.querySelector('#project-filters');
const projectCards = document.querySelectorAll('.project-card');

if (projectFiltersContainer && projectCards.length) {
    const projectFilters = [
        { tag: 'all', label: 'All' },
        { tag: 'computational-design', label: 'Computational Design' },
        { tag: 'cae-simulation', label: 'CAE & Simulation' },
        { tag: 'product-footwear', label: 'Product & Footwear' },
        { tag: 'xr-interaction', label: 'XR & Interaction' },
        { tag: 'research-rd', label: 'Research & R&D' }
    ];

    const createFilterButton = (tag, label, active = false) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'project-filter';
        if (active) {
            button.classList.add('project-filter--active');
        }
        button.dataset.tag = tag;
        button.textContent = label;
        button.setAttribute('aria-pressed', active ? 'true' : 'false');
        return button;
    };

    const fragment = document.createDocumentFragment();
    projectFilters.forEach((filter, index) => {
        fragment.appendChild(createFilterButton(filter.tag, filter.label, index === 0));
    });
    projectFiltersContainer.appendChild(fragment);

    const setActiveButton = (selectedTag) => {
        projectFiltersContainer.querySelectorAll('.project-filter').forEach(btn => {
            const isActive = btn.dataset.tag === selectedTag;
            btn.classList.toggle('project-filter--active', isActive);
            btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
    };

    const filterCards = (tag) => {
        projectCards.forEach(card => {
            const categories = (card.dataset.categories || '').split(/\s+/);
            const matches = tag === 'all' || categories.includes(tag);
            card.classList.toggle('is-hidden', !matches);
        });
    };

    projectFiltersContainer.addEventListener('click', (event) => {
        const button = event.target.closest('.project-filter');
        if (!button) return;
        const selectedTag = button.dataset.tag;
        setActiveButton(selectedTag);
        filterCards(selectedTag);
    });
}
