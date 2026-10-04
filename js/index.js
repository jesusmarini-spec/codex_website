const navToggle = document.querySelector('.nav__toggle');
const navLink = document.querySelectorAll('.nav__link');

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
navToggle.addEventListener('click', () => {

    document.body.classList.toggle('nav__open');

});

navLink.forEach(link =>{
    link.addEventListener('click', () =>{
        document.body.classList.remove('nav__open');
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
//------------click
/*var message="Right-click has been disabled";
function clickIE() {
    if (document.all) {
        (message);
        return false;
    }
}
function clickNS(e) {
    if (document.layers || (document.getElementById && !document.all)) {
        if (e.which == 2||e.which == 3) {
            (message);
            return false;
        }
    }
}
if (document.layers) {
    document.captureEvents(Event.MOUSEDOWN);
    document.onmousedown = clickNS;
} else {
    document.onmouseup = clickNS;
    document.oncontextmenu = clickIE;
}
document.oncontextmenu = new Function("return false");
document.getElementsByClassName('my-img').ondragstart = function() { return false; };*/
