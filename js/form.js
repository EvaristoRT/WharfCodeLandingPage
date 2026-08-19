const form = document.querySelector(".contact__form");
const nombre = document.getElementById("nombre");
const correo = document.getElementById("correo");
const proyecto = document.getElementById("proyecto");
const textArea = document.getElementById("descripcion");
const projectDescriptionLenght = document.getElementById("project-description-lenght");
const honeypot = document.getElementById("website_hp"); // Ajusta el ID según tu HTML

const errorContainer = document.getElementById("error-message");
const submitBtn = form ? form.querySelector("button[type='submit']") : null;

async function analiceForm(event) {
    // 1. Siempre prevenimos el envío por defecto del formulario HTML
    event.preventDefault();

    // Verificación Honeypot para bots
    if (honeypot && honeypot.value !== "") {
        console.warn("Bot detectado mediante Honeypot.");
        return false; 
    }

    let errores = [];

    // Validaciones
    if (nombre.value.trim() === "") {
        errores.push("El campo 'Nombre' es obligatorio.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correo || correo.value.trim() === "") {
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

    // Gestionar la muestra de errores o realizar la petición
    if (errores.length > 0) {
        errorContainer.style.display = "block";
        errorContainer.style.color = "red";
        errorContainer.innerHTML = errores.map(err => `<p>• ${err}</p>`).join("");
    } else {
        errorContainer.style.display = "none";

        // Si no hay errores, se envía la petición HTTP al servidor
        await enviarCorreo();
    }
}

async function enviarCorreo() {
    // Deshabilitar el botón y mostrar estado de carga
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Enviando...";
    }

    // Objeto con los datos que recibirá el backend
    const data = {
        nombre: nombre.value.trim(),
        email: correo.value.trim(),
        proyecto: proyecto.value,
        descripcion: textArea.value.trim()
    };

    try {
        // Reemplaza '/api/send-email' por la ruta real de tu servidor o Serverless Function
        const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            errorContainer.style.display = "block";
            errorContainer.style.color = "green";
            errorContainer.innerHTML = "<p>¡Mensaje enviado con éxito!</p>";
            
            // Limpiar el formulario
            form.reset();
            updateCharacterCount();
        } else {
            errorContainer.style.display = "block";
            errorContainer.style.color = "red";
            errorContainer.innerHTML = `<p>Error: ${result.error || 'No se pudo enviar el correo.'}</p>`;
        }
    } catch (error) {
        console.error("Error de red:", error);
        errorContainer.style.display = "block";
        errorContainer.style.color = "red";
        errorContainer.innerHTML = "<p>Error al conectar con el servidor. Inténtalo más tarde.</p>";
    } finally {
        // Restaurar el botón
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Enviar";
        }
    }
}

// Evento Submit
if (form) {
    form.addEventListener("submit", analiceForm);
}

// Contador de caracteres para la descripción
function updateCharacterCount() {
    if (textArea && projectDescriptionLenght) {
        const currentLength = textArea.value.length;
        projectDescriptionLenght.textContent = `${currentLength}/500`;
    }
}

if (textArea) {
    textArea.addEventListener("input", updateCharacterCount);
    updateCharacterCount();
}