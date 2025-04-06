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
    const scrollPosition = document.body.scrollTop || document.documentElement.scrollTop;

    // Si el scroll es mayor a 650px, mostrar el botón con animación hacia arriba
    if (scrollPosition > 650) {
        // Si ya está visible y en posición, no hacer nada
        if (pos === 2 && scrollButton.style.display === "block") return;
        
        // Si estaba ocultándose (animación hacia abajo), cancelarla
        if (isAnimating && pos > 0) {
            clearInterval(animationInterval);
            isAnimating = false;
        }
        
        scrollButton.style.display = "block";
        
        // Animación de entrada (hacia arriba)
        if (!isAnimating && pos < 2) {
            isAnimating = true;
            animationInterval = setInterval(() => {
                if (pos < 2) {
                    pos += 0.5; // Velocidad de subida
                    scrollButton.style.bottom = pos + "%";
                } else {
                    clearInterval(animationInterval);
                    isAnimating = false;
                }
            }, 20); 
        }
    } 
    // Si el scroll es menor a 650px, ocultar el botón con animación hacia abajo
    else {
        // Si ya está oculto o en posición 0, no hacer nada
        if (pos === 0 || scrollButton.style.display === "none") return;
        
        // Animación de salida (hacia abajo)
        if (!isAnimating && pos > 0) {
            isAnimating = true;
            clearInterval(animationInterval); // Limpiar intervalo previo
            animationInterval = setInterval(() => {
                if (pos > 0) {
                    pos -= 0.5; // Velocidad de bajada
                    scrollButton.style.bottom = pos + "%";
                } else {
                    scrollButton.style.display = "none";
                    clearInterval(animationInterval);
                    isAnimating = false;
                }
            }, 20);
        }
    }
}


// Función para crear botones de adición
function crearBotonesAdicion() {
    const productos = document.querySelectorAll('.listajuegos li');

    productos.forEach((producto) => {
        // Eliminar botones de adición existentes para evitar duplicados
        const existingAddButton = producto.querySelector('.add-button');
        if (existingAddButton) {
            existingAddButton.remove();
        }

        // Crear y agregar el botón de adición
        const addButton = crearBoton("+", "add-button", "blue", function () {
            moverProducto(producto);
        });
        producto.appendChild(addButton);
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
    let mensaje = "Hola! Le escribo para pedirle los siguientes juegos:\n";

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

//Función para cambiar la vista de imágenes a texto
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
            
            li.style.marginLeft += "10px";

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

            li.style.marginLeft -= "10px";

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

    // Llamar a la función para recrear los botones de adición y eliminación
    recrearBotonesEliminacion();
    recrearBotonesAdicion();
}

function recrearBotonesEliminacion() {
    const productosEnResultados = document.querySelectorAll('#resultados li');

    productosEnResultados.forEach((producto) => {
        // Eliminar botones de eliminación existentes para evitar duplicados
        const existingRemoveButton = producto.querySelector('.remove-button');
        if (existingRemoveButton) {
            existingRemoveButton.remove();
        }

        // Crear y agregar el botón de eliminación solo si el producto está en resultados
        const removeButton = crearBoton("x", "remove-button", "red", function () {
            devolverProducto(producto);
        });
        producto.appendChild(removeButton);
    });
}

function recrearBotonesAdicion() {
    const productosEnDescartados = document.querySelectorAll('#juegosdescartados li');

    productosEnDescartados.forEach((producto) => {
        // Eliminar botones de adicion existentes para evitar duplicados
        const existingAddButton = producto.querySelector('.add-button');
        if (existingAddButton) {
            existingAddButton.remove();
        }

        // Crear y agregar el botón de adicion solo si el producto está en descartados
        const addButton = crearBoton("+", "add-button", "blue", function () {
            moverProducto(producto);
        });
        producto.appendChild(addButton);
    });
}