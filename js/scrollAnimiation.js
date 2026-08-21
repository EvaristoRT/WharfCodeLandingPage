// Seleccionamos todos los elementos con la clase animar-scroll
const elementos = document.querySelectorAll('.animar-scroll');

// Creamos el observador
const observador = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
        // Si el elemento entra en la pantalla
        if (entrada.isIntersecting) {
            entrada.target.classList.add('visible');
        }
    });
});

// Le decimos al observador que vigile cada elemento
elementos.forEach(elemento => {
    observador.observe(elemento);
});