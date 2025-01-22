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

            if (filtroNombre !== "" && !productName.includes(filtroNombre)) {
                mostrarProducto = false;
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