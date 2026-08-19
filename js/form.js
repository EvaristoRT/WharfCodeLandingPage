const form = document.querySelector(".contact__form");
const nombre = document.getElementById("nombre")
const proyecto = document.getElementById("proyecto")
const textArea = document.getElementById("descripcion");
const projectDescriptionLenght = document.getElementById("project-description-lenght");

const errorContainer = document.getElementById("error-message");

function analiceForm(event) {
    if (honeypot && honeypot.value !== "") {
        event.preventDefault();
        console.warn("Bot detectado mediante Honeypot.");
        return false; 
    }
    let errores = [];

    if (nombre.value.trim() === "") {
        errores.push("El campo 'Nombre' es obligatorio.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (correo.value.trim() === "") {
        errores.push("El campo 'Correo Electrónico' es obligatorio.");
    } else if (!emailRegex.test(correo.value.trim())) {
        errores.push("Ingresa un correo electrónico válido.");
    }

    if (proyecto.value === "") {
        errores.push("Debe seleccionar un 'Tipo de Proyecto'.");
    }

    const descripcionTexto = textArea.value.trim();
    if (descripcionTexto.length > 0 && descripcionTexto.length < 20) {
        errores.push("La descripción debe tener al menos 20 caracteres si decides llenarla.");
    }

    // Gestionar la muestra de errores o el envío
    if (errores.length > 0) {
        event.preventDefault(); // Detiene el envío
        errorContainer.style.display = "block";
        errorContainer.innerHTML = errores.map(err => `<p>• ${err}</p>`).join("");
    } else {
        errorContainer.style.display = "none";
    }
}

// Evento Submit
if (form) {
    form.addEventListener("submit", analiceForm);
}

// Contador de caracteres para la descripción
function updateCharacterCount() {
    const currentLength = textArea.value.length;
    projectDescriptionLenght.textContent = `${currentLength}/500`;
}

textArea.addEventListener("input", updateCharacterCount);
updateCharacterCount();