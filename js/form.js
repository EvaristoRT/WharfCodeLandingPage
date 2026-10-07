const form = document.querySelector(".contact__form");
const nombre = document.getElementById("nombre");
const correo = document.getElementById("correo");
const proyecto = document.getElementById("proyecto");
const textArea = document.getElementById("descripcion");
const projectDescriptionLenght = document.getElementById("project-description-lenght");
const honeypot = document.getElementById("website_hp"); // Ajusta el ID según tu HTML

const errorContainer = document.getElementById("error-message");
const submitBtn = form ? form.querySelector("button[type='submit']") : null;

const submitLabel = submitBtn ? submitBtn.textContent : "";

const campos = form ? form.querySelectorAll("input, select, textarea") : [];
let enviando = false;

function hideMessage() {
    errorContainer.style.display = "none";
    errorContainer.replaceChildren();
}

// Muestra un mensaje en el formulario. textContent evita inyectar HTML del servidor.
function showMessage(type, lines) {
    errorContainer.className = "error-box is-" + type;
    errorContainer.style.display = "block";
    const textos = [].concat(lines).map(line => {
        const p = document.createElement("p");
        p.textContent = (type === "error" ? "• " : "") + line;
        return p;
    });
    const cerrar = document.createElement("button");
    cerrar.type = "button";
    cerrar.className = "error-box__close";
    cerrar.setAttribute("aria-label", "Cerrar mensaje");
    cerrar.textContent = "×";
    cerrar.addEventListener("click", hideMessage);
    errorContainer.replaceChildren(...textos, cerrar);
    errorContainer.focus({ preventScroll: true });
    errorContainer.scrollIntoView({ block: "nearest", behavior: "smooth" });
}

// Mensaje de error por campo (null si el campo es válido)
function erroresPorCampo() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const descripcion = textArea.value.trim();
    return {
        nombre: nombre.value.trim() === "" ? "El campo 'Nombre' es obligatorio." : null,
        correo: correo.value.trim() === ""
            ? "El campo 'Correo Electrónico' es obligatorio."
            : !emailRegex.test(correo.value.trim()) ? "Ingresa un correo electrónico válido." : null,
        proyecto: proyecto.value === "" ? "Debe seleccionar un 'Tipo de Proyecto'." : null,
        descripcion: descripcion.length > 0 && descripcion.length < 20
            ? "La descripción debe tener al menos 20 caracteres si decides llenarla." : null
    };
}

// Lista plana de problemas (vacía si el formulario es válido)
function validar() {
    return Object.values(erroresPorCampo()).filter(Boolean);
}

// Un mensaje bajo cada campo; solo se muestra en campos que la persona ya tocó
const camposValidados = { nombre, correo, proyecto, descripcion: textArea };
const campoTocado = new Set();
const mensajesCampo = {};

Object.entries(camposValidados).forEach(([clave, campo]) => {
    const mensaje = document.createElement("p");
    mensaje.className = "field-error";
    mensaje.id = "error-" + campo.id;
    const ancla = campo.closest(".select-container, .project-description-container") || campo;
    ancla.insertAdjacentElement("afterend", mensaje);
    campo.setAttribute("aria-describedby", mensaje.id);
    mensajesCampo[clave] = mensaje;

    campo.addEventListener("blur", () => { campoTocado.add(clave); mostrarErroresCampo(); });
});

function mostrarErroresCampo() {
    const errores = erroresPorCampo();
    Object.entries(camposValidados).forEach(([clave, campo]) => {
        const texto = campoTocado.has(clave) ? errores[clave] : null;
        mensajesCampo[clave].textContent = texto || "";
        campo.setAttribute("aria-invalid", texto ? "true" : "false");
    });
}

// El botón solo está activo si el formulario es válido y no se está enviando
function actualizarEstado() {
    if (submitBtn) submitBtn.disabled = enviando || validar().length > 0;
}

async function analiceForm(event) {
    // 1. Siempre prevenimos el envío por defecto del formulario HTML
    event.preventDefault();

    // Verificación Honeypot para bots
    if (honeypot && honeypot.value !== "") {
        console.warn("Bot detectado mediante Honeypot.");
        return false; 
    }

    const errores = validar();

    // Gestionar la muestra de errores o realizar la petición
    if (errores.length > 0) {
        showMessage("error", errores);
    } else {
        hideMessage();

        // Si no hay errores, se envía la petición HTTP al servidor
        await enviarCorreo();
    }
}

async function enviarCorreo() {
    // Deshabilitar el botón y mostrar estado de carga
    enviando = true;
    campos.forEach(c => c.disabled = true);
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

        const result = await response.json().catch(() => ({}));

        if (response.ok) {
            showMessage("success", "¡Mensaje enviado! Te responderemos pronto.");
            
            // Limpiar el formulario
            form.reset();
            campoTocado.clear();
            mostrarErroresCampo();
            updateCharacterCount();
        } else {
            showMessage("error", result.error || "No se pudo enviar el mensaje.");
        }
    } catch (error) {
        console.error("Error de red:", error);
        showMessage("error", "No pudimos conectar con el servidor. Inténtalo de nuevo en unos minutos.");
    } finally {
        // Restaurar campos y botón
        enviando = false;
        campos.forEach(c => c.disabled = false);
        if (submitBtn) submitBtn.textContent = submitLabel;
        actualizarEstado();
    }
}

// Evento Submit
if (form) {
    form.addEventListener("submit", analiceForm);
    // Al editar: se quita el mensaje anterior y se recalcula si se puede enviar
    form.addEventListener("input", () => { hideMessage(); mostrarErroresCampo(); actualizarEstado(); });
    form.addEventListener("change", () => { if (document.activeElement === proyecto) campoTocado.add("proyecto"); mostrarErroresCampo(); actualizarEstado(); });
    actualizarEstado();
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