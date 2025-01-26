var scrollButton = document.getElementById('botonarriba');
window.onscroll = function() {
    mostrarBoton();
};
function mostrarBoton() {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        botonarriba.classList.add('show');
    } else {
        botonarriba.classList.remove('show');
    }
}
function busqueda() {
    const maxPrice = parseFloat(document.getElementById("buscarprecio").value);
    const filtroNombre = document.getElementById("buscarnombre").value.toLowerCase();
    const grupos = document.querySelectorAll('.grupo-juegos');
    const text = document.getElementById("texto");

    let hayResultados = false;

    const botonborrarbusqueda = document.getElementById('botonborrarbusqueda');
    botonborrarbusqueda.style.display = "inline-block";
    const botonborrarprecio = document.getElementById('botonborrarprecio');
    botonborrarprecio.style.display = "inline-block";

    grupos.forEach((grupo) => {
        const encabezado = grupo.querySelector('h4');
        const productos = grupo.querySelectorAll('.listajuegos li');
        let mostrarGrupo = false;

        productos.forEach((producto) => {
            const productName = producto.textContent.toLowerCase();
            const productPrice = parseFloat(encabezado.getAttribute("data-price"));

            let mostrarProducto = true;

            if (!isNaN(maxPrice) && productPrice > maxPrice) {
                mostrarProducto = false;
            }

            if (isNaN(maxPrice)) {
                botonborrarprecio.style.display = "none";
            }

            if (filtroNombre !== "" && !productName.includes(filtroNombre)) {
                mostrarProducto = false;
            }

            if (filtroNombre == "" && productName.includes(filtroNombre)) {
                botonborrarbusqueda.style.display = "none";
            }

            producto.style.display = mostrarProducto ? "list-item" : "none";

            if (mostrarProducto) {
                mostrarGrupo = true;
            }
        });

        encabezado.style.display = mostrarGrupo ? "block" : "none";

        grupo.style.display = mostrarGrupo ? "block" : "none";

        if (mostrarGrupo) {
            hayResultados = true;
        }
    });
    
    text.textContent = hayResultados ? "" : "No hay resultados.";
}    
// Función para borrar el campo de búsqueda
function borrarbusqueda() {
const buscarnombreInput = document.getElementById('buscarnombre');
// Limpiar el campo de texto
buscarnombreInput.value = "";
busqueda();
}
// Función para borrar el campo de precio
function borrarprecio(){
const filtroprecioInput = document.getElementById('buscarprecio');
// Limpiar el campo de texto
filtroprecioInput.value = "";
busqueda();
}