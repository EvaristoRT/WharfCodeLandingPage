const menuButton = document.querySelector(".nav__menu");
const closeMenuButton = document.querySelector(".side-menu__close");
const sideMenu = document.querySelector(".side-menu");

// Seleccionamos todos los enlaces dentro del menú desplegable
const sideMenuLinks = document.querySelectorAll(".side-menu a");

function openMenu() {
    sideMenu.classList.add("open");
    document.body.classList.add("menu-open");
    menuButton.setAttribute("aria-expanded", "true");
    closeMenuButton.focus();
}

// Función reutilizable para cerrar el menú
function closeMenu() {
    sideMenu.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuButton.setAttribute("aria-expanded", "false");
}

if (menuButton) menuButton.addEventListener("click", openMenu);
if (closeMenuButton) {
    closeMenuButton.addEventListener("click", () => {
        closeMenu();
        menuButton.focus();
    });
}

// Cerrar menú automáticamente al hacer clic en cualquier enlace interno
sideMenuLinks.forEach(link => link.addEventListener("click", closeMenu));

// Cerrar con Escape
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sideMenu.classList.contains("open")) {
        closeMenu();
        menuButton.focus();
    }
});
