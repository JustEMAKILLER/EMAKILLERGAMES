// Crear los botones de adición automáticamente al cargar la página
document.addEventListener('DOMContentLoaded', function () {
    crearBotonesAdicion();
    actualizarPrecio();
    mostrarBoton();
});

// Función para mostrar/ocultar el botón basado en el scroll
window.onscroll = function () {
    mostrarBoton();
};

function mostrarBoton() {
const scrollButton = document.getElementById("botonarriba");
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        scrollButton.classList.add('show'); // Muestra el botón si el scroll supera 100px
    } else {
        scrollButton.classList.remove('show'); // Oculta el botón si el scroll es menor
    }
}

// Función para crear botones de adición
function crearBotonesAdicion() {
    const productos = document.querySelectorAll('.listajuegos li');

    productos.forEach((producto) => {
        if (!producto.querySelector('.add-button')) {
            const addButton = crearBoton("+", "add-button", "blue", function () {
                moverProducto(producto);
            });
            producto.appendChild(addButton);
        }
    });
}
    
    // Funcion para verificar si hay elementos en la lista de descartados
    function hayDescartados(){
    const juegosdescartadosDiv = document.getElementById("juegosdescartados");
    const listaDescartados = juegosdescartadosDiv.querySelector('ul');
    juegosdescartadosDiv.style.display = listaDescartados.children.length > 0 ? "block" : "none";}

// Función para mover un producto al div de resultados
function moverProducto(producto) {
    const resultadosDiv = document.getElementById("resultados");
    const calculoprecio = document.getElementById("calculoprecio");

    resultadosDiv.style.display = "block";
    calculoprecio.style.display = "block";

    // Eliminar botón de añadir si existe
    const addButton = producto.querySelector('.add-button');
    if (addButton) addButton.remove();

    // Crear botón de eliminar
    if (!producto.querySelector('.remove-button')) {
        const removeButton = crearBoton("x", "remove-button", "red", function () {
            devolverProducto(producto);
        });
        producto.appendChild(removeButton);
    }

    resultadosDiv.appendChild(producto);
    hayDescartados();
    actualizarPrecio();
}

// Función para devolver un producto a juegosdescartadosDiv
function devolverProducto(producto) {
    const juegosdescartadosDiv = document.getElementById("juegosdescartados");
    const listaDescartados = juegosdescartadosDiv.querySelector('ul');

    // Eliminar botón de eliminar
    const removeButton = producto.querySelector('.remove-button');
    if (removeButton) removeButton.remove();

    // Crear botón de añadir
    if (!producto.querySelector('.add-button')) {
        const addButton = crearBoton("+", "add-button", "blue", function () {
            moverProducto(producto);
        });
        producto.appendChild(addButton);
    }


    listaDescartados.appendChild(producto);

    ordenarListaAlfabeticamente(listaDescartados);
    hayDescartados();
    actualizarPrecio();
}

// Función para mover todos los elementos de juegosdescartadosDiv a resultadosDiv
function addall() {
    const juegosdescartadosDiv = document.getElementById("juegosdescartados");
    const resultadosDiv = document.getElementById("resultados");
    const items = Array.from(juegosdescartadosDiv.querySelectorAll('li'));

    items.forEach(item => {
        moverProducto(item); // Reutilizamos la función para asegurar la lógica consistente
    });
    juegosdescartadosDiv.style.display = "none";
    actualizarPrecio();
}

// Función para borrar todos los elementos de resultadosDiv y moverlos a juegosdescartadosDiv
function borrarelem() {
    const resultadosDiv = document.getElementById("resultados");
    const items = Array.from(resultadosDiv.querySelectorAll('li'));

    items.forEach(item => {
        devolverProducto(item); // Reutilizamos la función para asegurar la lógica consistente
    });
    hayDescartados();
    actualizarPrecio();
}

// Función para actualizar el precio total
function actualizarPrecio() {
    const resultadosDiv = document.getElementById("resultados");
    const calculoprecio = document.getElementById("calculoprecio");
    const items = resultadosDiv.querySelectorAll('li');
    let total = 0;

    items.forEach(item => {
        const price = parseFloat(item.getAttribute("data-price"));
        if (!isNaN(price)) total += price;
    });

    calculoprecio.textContent = "Precio total: " + total + "$";

    resultadosDiv.style.display = items.length > 0 ? "block" : "none";
    calculoprecio.style.display = items.length > 0 ? "block" : "none";
}

// Función para ordenar alfabéticamente una lista
function ordenarListaAlfabeticamente(lista) {
    const items = Array.from(lista.querySelectorAll('li'));

    items.sort((a, b) => {
        const textA = a.textContent.trim().toLowerCase();
        const textB = b.textContent.trim().toLowerCase();
        return textA.localeCompare(textB);
    });

    lista.innerHTML = ""; // Vaciar la lista
    items.forEach(item => lista.appendChild(item));
}

// Función para crear un botón con propiedades
function crearBoton(text, className, color, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = className;
    button.style.marginLeft = "10px";
    button.style.cursor = "pointer";
    button.style.color = color;
    button.onclick = onClick;
    return button;
}

//Función para establecer la búsqueda
function busqueda() {
    const maxPrice = parseFloat(document.getElementById("buscarprecio").value);
    const filtroNombre = document.getElementById("buscarnombre").value.toLowerCase();
    const grupos = document.querySelectorAll('.grupo-juegos');
    const text = document.getElementById("texto");
    let calculoprecio = document.getElementById("calculoprecio");
    const resultadosDiv = document.getElementById("resultados");
    let hayResultados = false;
    const botonborrarbusqueda = document.getElementById('botonborrarbusqueda');
    botonborrarbusqueda.style.display = "inline-block";
    const botonborrarprecio = document.getElementById('botonborrarprecio');
    botonborrarprecio.style.display = "inline-block";
    grupos.forEach((grupo) => {
        const productos = grupo.querySelectorAll('.listajuegos li');
        let mostrarGrupo = false;

        productos.forEach((producto) => {
            const productName = producto.textContent.toLowerCase();
            const productPrice = parseFloat(producto.getAttribute("data-price"));

            let mostrarProducto = true;

            // Filtrar por precio y nombre
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

        grupo.style.display = mostrarGrupo ? "block" : "none";

        if (mostrarGrupo) {
            hayResultados = true;
        }

        if (calculoprecio.textContent !== "") {
            calculoprecio.style.display = "block";
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
//Función para mostrar solo los titulos nuevos o actualizados
function mostrarJuegosNewOrAct() {
    borrarbusqueda();
    borrarprecio();
    const grupos = document.querySelectorAll('.grupo-juegos');
    const botonJNA = document.getElementById("botonJNA");
    const botonMostrar = document.getElementById("botonMostrar");
    const encabezadosJuegos = document.querySelectorAll('.encabezadosjuegos');
    const text = document.getElementById("texto");
    const divBusqueda = document.getElementById("buscar");
    let hayResultados = false;
 grupos.forEach((grupo) => {
    const productos = grupo.querySelectorAll('.listajuegos li');
    productos.forEach((producto) => {
        const esNewOrAct = producto.querySelector('p.juegosnuevos, p.juegosactualizados') !== null; 
    if (esNewOrAct){
        producto.style.display = "list-item";
        hayResultados = true;
    } else {
        producto.style.display = "none";
    }
})
 })
 encabezadosJuegos.forEach((encabezadoJuego) => {
 encabezadoJuego.style.display = "none";})
 divBusqueda.style.display = "none";
 text.textContent = hayResultados ? "" : "No hay juegos nuevos o actualizados.";
 botonJNA.style.display = "none";
 botonMostrar.style.display = "flex";
}
//Función para mostrar todos los juegos de nuevo
function mostrarJuegos() {
    const grupos = document.querySelectorAll('.grupo-juegos');
    const botonJNA = document.getElementById("botonJNA");
    const botonMostrar = document.getElementById("botonMostrar");
    const encabezadosJuegos = document.querySelectorAll('.encabezadosjuegos');
    const divBusqueda = document.getElementById("buscar");
    const text = document.getElementById("texto");
 grupos.forEach((grupo) => {
    const productos = grupo.querySelectorAll('.listajuegos li');
    productos.forEach((producto) => {
        producto.style.display = "list-item";
})
 })
 encabezadosJuegos.forEach((encabezadoJuego) => {
 encabezadoJuego.style.display = "block";})
 divBusqueda.style.display = "flex";
 botonMostrar.style.display = "none";
 botonJNA.style.display = "flex";
 text.textContent = "Todos funcionan en LAN";
}
