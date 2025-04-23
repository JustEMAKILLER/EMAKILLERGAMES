// Crear los botones de adición automáticamente al cargar la página
document.addEventListener('DOMContentLoaded', function () {
    crearBotonesAdicion();
    actualizarPrecio();
});

// Escuchar el evento de scroll para mostrar el botón de desplazamiento
window.addEventListener("scroll", mostrarBoton);

// Variables globales para controlar el intervalo y la posición
let animationInterval = null;
let pos = 0;
let isAnimating = false;

function mostrarBoton() {
    const scrollButton = document.getElementById("botonarriba");
    const scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;

    // Limpiar intervalo anterior si existe
    if (animationInterval) {
        clearInterval(animationInterval);
        isAnimating = false;
    }

    // Si el scroll es mayor a 650px, mostrar el botón con animación hacia arriba
    if (scrollPosition > 650) {
        scrollButton.style.display = "block";
        
        // Animación de entrada (hacia arriba)
        animationInterval = setInterval(() => {
            if (pos < 2) {
                pos = Math.min(2, pos + 0.5); // Asegurar que no pase de 2
                scrollButton.style.bottom = pos + "%";
            } else {
                clearInterval(animationInterval);
                isAnimating = false;
            }
        }, 20);
    } 
    // Si el scroll es menor a 650px, ocultar el botón con animación hacia abajo
    else {
        // Animación de salida (hacia abajo)
        animationInterval = setInterval(() => {
            if (pos > 0) {
                pos = Math.max(0, pos - 0.5); // Asegurar que no sea menor que 0
                scrollButton.style.bottom = pos + "%";
            } else {
                scrollButton.style.display = "none";
                clearInterval(animationInterval);
                isAnimating = false;
            }
        }, 20);
    }
}

// Función para crear botones de adición
function crearBotonesAdicion() {
    document.querySelectorAll('.listajuegos li:not(#resultados li):not(#juegosdescartados li)').forEach(producto => {
        reconstruirBotonPrincipal(producto);
    });
}
    
    // Funcion para verificar si hay elementos en la lista de descartados
    function hayDescartados(){
    const juegosdescartadosDiv = document.getElementById("juegosdescartados");
    const listaDescartados = juegosdescartadosDiv.querySelectorAll('li');
    juegosdescartadosDiv.style.display = listaDescartados.length > 0 ? "block" : "none";}

// Función para mover un producto al div de resultados
function moverProducto(producto) {
    const resultadosDiv = document.getElementById("resultados");
    const listaResultados = resultadosDiv.querySelector("ul");
    const calculoprecio = document.getElementById("calculoprecio");

    listaResultados.style.display = "flex";
    calculoprecio.style.display = "block";

    // Eliminar botón de añadir si existe
    const addButton = producto.querySelector('.add-button');
    if (addButton) addButton.remove();

    // Crear botón de eliminar si no existe
    if (!producto.querySelector('.remove-button')) {
        const removeButton = crearBoton("x", "remove-button", "red", function () {
            devolverProducto(producto);
        });
        producto.appendChild(removeButton);
    }

    listaResultados.appendChild(producto);

    ordenarListaAlfabeticamente(listaResultados);
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
function agregarTodo() {
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
function eliminarTodo() {
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
        // Obtener el título del juego de manera consistente, independientemente del modo de visualización
        const textA = obtenerTituloJuego(a).toLowerCase();
        const textB = obtenerTituloJuego(b).toLowerCase();
        return textA.localeCompare(textB);
    });

    lista.innerHTML = ""; // Vaciar la lista
    items.forEach(item => lista.appendChild(item));
}

// Función para obtener el título del juego de manera consistente, independientemente del modo de visualización
function obtenerTituloJuego(item) {
    // Si está en modo tradicional, obtener el texto del enlace o del li
    if (document.body.classList.contains("vista-tradicional")) {
        const enlace = item.querySelector('a');
        return enlace ? enlace.textContent.trim() : item.textContent.trim();
    } else {
        // En modo imágenes, obtener el título de la imagen
        const img = item.querySelector('img');
        return img ? img.getAttribute('title').split(" -")[0].trim() : item.textContent.trim();
    }
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
    let hayResultados = false;
    const botonborrarbusqueda = document.getElementById('botonborrarbusqueda');
    const botonborrarprecio = document.getElementById('botonborrarprecio');
    const cajaNoHayResultados = document.getElementById("cajaNoHayResultados");
    cajaNoHayResultados.style.display = "none";
    const article = document.querySelector("article");
    article.style.display = "block";

    // Mostrar u ocultar los botones de limpieza de búsqueda según corresponda
    botonborrarbusqueda.style.display = filtroNombre ? "inline-block" : "none";
    botonborrarprecio.style.display = isNaN(maxPrice) ? "none" : "inline-block";

    grupos.forEach((grupo) => {
        const productos = grupo.querySelectorAll('.listajuegos li');
        let mostrarGrupo = false;

        productos.forEach((producto) => {
            // Verificar si hay una imagen con el atributo title o solo un enlace
            const productNameFromImg = producto.querySelector('img')?.getAttribute("title");
            const productNameFromLink = producto.querySelector('a')?.textContent.trim();

            // Si hay un título en la imagen, usa eso, si no, usa el texto del enlace
            const productName = productNameFromImg ? productNameFromImg.split(" -")[0].toLowerCase() : (productNameFromLink ? productNameFromLink.toLowerCase() : "");
            const productPrice = parseFloat(producto.getAttribute("data-price"));
            let mostrarProducto = true;

            // Filtrar por precio
            if (!isNaN(maxPrice) && productPrice > maxPrice) {
                mostrarProducto = false;
            }

            // Filtrar por nombre
            if (filtroNombre !== "" && !productName.includes(filtroNombre)) {
                mostrarProducto = false;
            }
            
            text.style.display = mostrarProducto ? "flex" : "none";
            producto.style.display = mostrarProducto ? "list-item" : "none";

            if (mostrarProducto) {
                mostrarGrupo = true;
                hayResultados = true;
            }
        });

        grupo.style.display = mostrarGrupo ? "block" : "none";
    });

    // Manejo correcto del texto de "No hay resultados."
    if (!hayResultados) {
        cajaNoHayResultados.style.display = "block";
        cajaNoHayResultados.innerHTML =  "No hay resultados.";
        article.style.display = "none";
     }

    // Mostrar u ocultar el cálculo de precio
    if (calculoprecio.textContent.trim() !== "") {
        calculoprecio.style.display = "block";
    }
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
 //Función para mostrar solo los titulos nuevos o actualizados
function mostrarJuegosNewOrAct() {
    borrarBusqueda();
    borrarPrecio();
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
        if (producto.classList.contains('juegosNuevos') || producto.classList.contains('juegosActualizados')){
        producto.style.display = "list-item";
        hayResultados = true;
    } else {
        producto.style.display = "none";
    }
})
 })
 encabezadosJuegos.forEach((encabezadoJuego) => {
 encabezadoJuego.style.display = "none";})
 divBusqueda.style.scale = "0";
 text.textContent = hayResultados ? "" : "No hay juegos nuevos o actualizados en esta sección.";
 botonJNA.style.display = "none";
 botonMostrar.style.display = "block";
}
//Función para mostrar todos los juegos de nuevo
function mostrarJuegos() {
    const grupos = document.querySelectorAll('.grupo-juegos');
    const botonJNA = document.getElementById("botonJNA");
    const botonMostrar = document.getElementById("botonMostrar");
    const encabezadosJuegos = document.querySelectorAll('.encabezadosjuegos');
    const text = document.getElementById("texto");
    const divBusqueda = document.getElementById("buscar");
 grupos.forEach((grupo) => {
    const productos = grupo.querySelectorAll('.listajuegos li');
    productos.forEach((producto) => {
        producto.style.display = "list-item";
})
 })
 encabezadosJuegos.forEach((encabezadoJuego) => {
 encabezadoJuego.style.display = "block";})
 divBusqueda.style.scale = "1";
 botonMostrar.style.display = "none";
 botonJNA.style.display = "block";
 text.textContent = "Todos funcionan en LAN";
}

//Función para mostrar el Menú Desplegable
function mostrarMenu(){
    const menuDesplegado = document.getElementById("menuDesplegado");
    menuDesplegado.style.display = "block";
    const botonMenuDesplegable = document.getElementById("botonMenuDesplegable");
    botonMenuDesplegable.style.display = "none";
    const botonMenuDesplegable2 = document.getElementById("botonMenuDesplegable2");
    botonMenuDesplegable2.style.display = "block";
    const botonesMenuDesplegado = document.querySelectorAll('#menuDesplegado a');
    botonesMenuDesplegado.forEach(botonMenu => {
    botonMenu.addEventListener('click', function(){
        cerrarMenu();
        })
    })}

//Función para cerrar el Menú Desplegable
function cerrarMenu(){
    const menuDesplegado = document.getElementById("menuDesplegado");
    const botonMenuDesplegable = document.getElementById("botonMenuDesplegable");
    botonMenuDesplegable.style.display = "block";
    const botonMenuDesplegable2 = document.getElementById("botonMenuDesplegable2");
    botonMenuDesplegable2.style.display = "none";
    menuDesplegado.style.display = "none";}

//Función para enviar el listado de juegos agregados por Whatsapp
function enviarListado() {
    const resultadosDiv = document.getElementById("resultados");
    const items = resultadosDiv.querySelectorAll('li');
    let total = 0;
    let mensaje = "Hola! Le escribo para solicitar los siguientes juegos:\n";

    items.forEach(item => {
        // Obtener el precio del juego
        const price = parseFloat(item.getAttribute("data-price"));
        if (!isNaN(price)) total += price;

        // Obtener el título del juego en ambas vistas (imágenes o texto)
        let tituloJuego = "";

        // Verificar si estamos en modo texto tradicional
        if (document.body.classList.contains("vista-tradicional")) {
            // En modo texto, el título está en el texto del <li> o del enlace
            const enlace = item.querySelector('a');
            if (enlace) {
                tituloJuego = enlace.textContent.trim(); // Obtener el texto del enlace
            } else {
                tituloJuego = item.textContent.trim(); // Obtener el texto del <li>
            }
        } else {
            // En modo imágenes, el título está en el atributo "title" de la imagen
            const img = item.querySelector('img');
            if (img) {
                tituloJuego = img.getAttribute('title'); // Obtener el título de la imagen
            }
        }

        // Agregar el título del juego al mensaje
        if (tituloJuego) {
            mensaje += tituloJuego + "\n" +"\n";
        }
    });

    // Agregar el precio total al mensaje
    mensaje += "Precio total: " + total + "$";

    // Codificar el mensaje para formato URL
    let mensajeURL = encodeURIComponent(mensaje);
    let URL = `https://wa.me/+5363975093?text=${mensajeURL}`;

    // Abrir la URL en una nueva pestaña
    window.open(URL, "_blank");
}

// Función para cambiar la vista de imágenes a texto
function cambiarVista() {
    const body = document.body;
    const isTraditional = body.classList.toggle("vista-tradicional");

    // Actualizar la visualización de las listas
    document.querySelectorAll("ul").forEach(ul => {
        ul.style.display = isTraditional ? "block" : "flex";
    });

    // Procesar cada elemento de la lista
    document.querySelectorAll("li").forEach(li => {
        if (isTraditional) {
            // Modo texto tradicional
            li.style.marginLeft = "10px";
            
            // Guardar contenido original si es la primera vez
            if (!li.dataset.originalContent) {
                li.dataset.originalContent = li.innerHTML;
            }

            const img = li.querySelector('img');
            if (img) {
                const nombreJuego = document.createTextNode(img.title);
                li.setAttribute('data-imgSrc', img.src);
                
                const enlace = li.querySelector('a');
                if (enlace) {
                    enlace.innerHTML = "";
                    enlace.appendChild(nombreJuego);
                } else {
                    li.innerHTML = "";
                    li.appendChild(nombreJuego);
                }
            }
        } else {
            // Modo imágenes
            li.style.marginLeft = "0";
            
            // Restaurar contenido original si existe
            if (li.dataset.originalContent) {
                li.innerHTML = li.dataset.originalContent;
            } else if (li.getAttribute('data-imgSrc')) {
                const img = document.createElement("img");
                img.src = li.getAttribute('data-imgSrc');
                img.title = li.textContent.trim();
                
                const enlace = li.querySelector('a');
                if (enlace) {
                    enlace.innerHTML = "";
                    enlace.appendChild(img);
                } else {
                    li.innerHTML = "";
                    li.appendChild(img);
                }
            }
        }
    });

    // Reconstruir todos los botones manteniendo los eventos
    reconstruirTodosLosBotones();
}

/**
 * Reconstruye todos los botones manteniendo sus eventos
 */
function reconstruirTodosLosBotones() {
    // 1. Botones en la lista principal
    document.querySelectorAll('.listajuegos li:not(#resultados li):not(#juegosdescartados li)').forEach(producto => {
        reconstruirBotonPrincipal(producto);
    });

    // 2. Botones en la lista de resultados
    document.querySelectorAll('#resultados li').forEach(producto => {
        reconstruirBotonResultado(producto);
    });

    // 3. Botones en la lista de descartados
    document.querySelectorAll('#juegosdescartados li').forEach(producto => {
        reconstruirBotonDescartado(producto);
    });
}

/**
 * Reconstruye botón para un producto en la lista principal
 */
function reconstruirBotonPrincipal(producto) {
    // Eliminar cualquier botón existente
    const existingAddButton = producto.querySelector('.add-button');
    const existingRemoveButton = producto.querySelector('.remove-button');
    if (existingAddButton) existingAddButton.remove();
    if (existingRemoveButton) existingRemoveButton.remove();

    // Solo crear botón de añadir si no está en resultados/descartados
    if (!producto.closest('#resultados') && !producto.closest('#juegosdescartados')) {
        const addButton = crearBoton("+", "add-button", "blue", function() {
            moverProducto(producto);
        });
        producto.appendChild(addButton);
    }
}

/**
 * Reconstruye botón para un producto en resultados
 */
function reconstruirBotonResultado(producto) {
    // Eliminar cualquier botón de añadir
    const existingAddButton = producto.querySelector('.add-button');
    if (existingAddButton) existingAddButton.remove();

    // Recrear botón de eliminar
    const existingRemoveButton = producto.querySelector('.remove-button');
    if (existingRemoveButton) existingRemoveButton.remove();
    
    const removeButton = crearBoton("x", "remove-button", "red", function() {
        devolverProducto(producto);
    });
    producto.appendChild(removeButton);
}

/**
 * Reconstruye botón para un producto en descartados
 */
function reconstruirBotonDescartado(producto) {
    // Eliminar cualquier botón de eliminar
    const existingRemoveButton = producto.querySelector('.remove-button');
    if (existingRemoveButton) existingRemoveButton.remove();

    // Recrear botón de añadir
    const existingAddButton = producto.querySelector('.add-button');
    if (existingAddButton) existingAddButton.remove();
    
    const addButton = crearBoton("+", "add-button", "blue", function() {
        moverProducto(producto);
    });
    producto.appendChild(addButton);
}
