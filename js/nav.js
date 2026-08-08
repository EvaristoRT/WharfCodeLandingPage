const menuButton = document.querySelector(".nav__menu");
const closeMenuButton = document.querySelector(".side-menu__close");
const sideMenu = document.querySelector(".side-menu");

menuButton.addEventListener("click",()=>{
    sideMenu.classList.add("open");
    document.body.classList.add("menu-open");
});

closeMenuButton.addEventListener("click", ()=>{
    sideMenu.classList.remove("open");
    document.body.classList.remove("menu-open");
})