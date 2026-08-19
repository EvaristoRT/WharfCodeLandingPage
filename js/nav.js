const menuButton = document.querySelector(".nav__menu");
const closeMenuButton = document.querySelector(".side-menu__close");
const sideMenu = document.querySelector(".side-menu");

// Seleccionamos todos los enlaces dentro del menú desplegable
const sideMenuLinks = document.querySelectorAll(".side-menu a");

// Función reutilizable para cerrar el menú
function closeMenu() {
    sideMenu.classList.remove("open");
    document.body.classList.remove("menu-open");
}

// Abrir menú
if (menuButton) {
    menuButton.addEventListener("click", () => {
        sideMenu.classList.add("open");
        document.body.classList.add("menu-open");
    });
}

// Cerrar menú con el botón 'X'
if (closeMenuButton) {
    closeMenuButton.addEventListener("click", closeMenu);
}

// Cerrar menú automáticamente al hacer clic en cualquier enlace interno
sideMenuLinks.forEach(link => {
    link.addEventListener("click", closeMenu);
});