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