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
function borrarBusqueda() {
const buscarnombreInput = document.getElementById('buscarnombre');
// Limpiar el campo de texto
buscarnombreInput.value = "";
busqueda();
}
// Función para borrar el campo de precio
function borrarPrecio(){
const filtroprecioInput = document.getElementById('buscarprecio');
// Limpiar el campo de texto
filtroprecioInput.value = "";
busqueda();
}
function cambiarVista() {
    const body = document.body;
    body.classList.toggle("vista-tradicional"); // Activa o desactiva la clase en el body

    const uls = document.querySelectorAll("ul");
    const lis = document.querySelectorAll("li");

    if (body.classList.contains("vista-tradicional")) {
        // Modo lista tradicional activado
        uls.forEach(ul => {
            ul.style.display = "block"; // Cambia a lista vertical
        });

        lis.forEach(li => {
            const enlace = li.querySelector("a");
            const img = li.querySelector("img");

            // Guardar el contenido original antes de modificarlo
            if (!li.dataset.originalContent) {
                li.dataset.originalContent = li.innerHTML;
            }

            if (img) {
                const nombreJuego = document.createTextNode(img.title);
                li.setAttribute('data-imgSrc', img.src); // Guarda la imagen antes de eliminarla
                img.remove(); // Elimina la imagen

                if (enlace) {
                    enlace.innerHTML = ""; // Limpia el enlace antes de agregar texto
                    enlace.appendChild(nombreJuego);
                } else {
                    li.innerHTML = ""; // Limpia el contenido del <li> para evitar duplicados
                    li.appendChild(nombreJuego);
                }
            }
        });

    } else {
        // Modo con imágenes activado (restaurar diseño original)
        uls.forEach(ul => {
            ul.style.display = "flex"; // Restaura el display original
        });

        lis.forEach(li => {
            const enlace = li.querySelector("a");
            const imgSrc = li.getAttribute('data-imgSrc');

            if (imgSrc) {
                const img = document.createElement("img");
                img.src = imgSrc;
                img.title = li.textContent.trim();

                if (enlace) {
                    enlace.innerHTML = "";
                    enlace.appendChild(img);
                } else {
                    li.innerHTML = ""; // Limpia el <li> antes de agregar la imagen
                    li.appendChild(img);
                }
            }

            // Restaurar el contenido original si existe
            if (li.dataset.originalContent) {
                li.innerHTML = li.dataset.originalContent;
                delete li.dataset.originalContent; // Eliminar el dato temporal
            }
        });
    }
}