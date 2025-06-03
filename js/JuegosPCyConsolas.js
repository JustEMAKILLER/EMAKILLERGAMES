// Crear los botones de adición automáticamente al cargar la página
document.addEventListener('DOMContentLoaded', function () {
    crearBotonesAdicion();
    agregarTextoNuevoOActualizado();
    agregarIconosFiltrosAJuegos();
    agregarListenersFiltros();
    agregarListenersImgBotonesMenu();
});

// Función para crear botones de adición
function crearBotonesAdicion() {
    document.querySelectorAll('.listajuegos li:not(#resultados li):not(#juegosdescartados li)').forEach(producto => {
        reconstruirBotonPrincipal(producto);
    });
}

//Añadir el texto de Nuevo o Actualizado a los juegos que lo sean
function agregarTextoNuevoOActualizado() {
    // Seleccionar los elementos li con las clases relevantes
    const elementosLi = document.querySelectorAll('li.juegosNuevos, li.juegosActualizados');

    elementosLi.forEach(li => {
        const enlace = li.querySelector('a');
        if (!enlace) return; // Si no hay enlace, salir

        // Determinar si es "Nuevo" o "Actualizado" según la clase
        const texto = li.classList.contains('juegosNuevos') ? '(Nuevo)' : '(Actualizado)';

        // Crear un elemento <p> con un espacio no rompible y el texto
        const p = document.createElement('p');
        p.innerHTML = `&nbsp;${texto}`;

        // Insertar el <p> después del <a>
        enlace.parentNode.insertBefore(p, enlace.nextSibling);
    });
}

// Función para añadir iconos de conexión y género a cada juego
function agregarIconosFiltrosAJuegos() {
    document.querySelectorAll('.listajuegos li').forEach(li => {
        // Eliminar contenedor de iconos existente si hay
        const iconosExistente = li.querySelector('.li-iconos-filtros');
        if (iconosExistente) {
            iconosExistente.remove();
        }

        // Obtener conexiones y géneros del juego
        const conexiones = (li.getAttribute('Tconex') || '').split(',').map(c => c.trim());
        const generos = (li.getAttribute('Genero') || '').split(',').map(g => g.trim());

        // Crear contenedor de iconos solo si hay algo que mostrar
        if (conexiones.length > 0 || generos.length > 0) {
            const iconosContainer = document.createElement('div');
            iconosContainer.className = 'li-iconos-filtros';

            // Añadir clase adicional para juegos nuevos/actualizados
            if (li.classList.contains('juegosNuevos') || li.classList.contains('juegosActualizados')) {
                iconosContainer.classList.add('iconos-especiales');
            }

            // Añadir iconos de conexión
            conexiones.forEach(conexion => {
                if (conexion) {
                    const icono = document.createElement('img');
                    icono.className = 'li-icono-filtro';
                    icono.src = `img/filtros/${conexion}.png`;
                    icono.alt = conexion;
                    icono.title = conexion;
                    iconosContainer.appendChild(icono);
                }
            });

            // Añadir iconos de género
            generos.forEach(genero => {
                if (genero) {
                    const icono = document.createElement('img');
                    icono.className = 'li-icono-filtro';
                    icono.src = `img/filtros/${genero}.png`;
                    icono.alt = genero;
                    icono.title = genero;
                    iconosContainer.appendChild(icono);
                }
            });

            // Añadir contenedor de iconos al li
            li.appendChild(iconosContainer);
        }
    });
}

// Configurar listeners para filtros de conexión y género
function agregarListenersFiltros() {
    document.querySelectorAll('#filtro-conexion input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            document.querySelectorAll('.listajuegos li').forEach(li => {
                delete li.dataset.forceHidden;
            });
            aplicarFiltrosCombinados();
        });
    });

    document.querySelectorAll('#filtro-generos input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            document.querySelectorAll('.listajuegos li').forEach(li => {
                delete li.dataset.forceHidden;
            });
            aplicarFiltrosCombinados();
        });
    });
}

//Agregar los listeners a las imágenes de los botones del menú de juegos
function agregarListenersImgBotonesMenu() {
    document.querySelectorAll('#menuDesplegado a img').forEach(img => {
        img.addEventListener('click', desmarcarCheckboxes);
    });
}

// Escuchar el evento de scroll para mostrar el botón de desplazamiento
window.addEventListener("scroll", mostrarBoton);

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

//Desmarcar todos los checkboxes de los filtros de conexión y género
function desmarcarCheckboxes() {
    //Determinar si estamos en modo "solo nuevos/actualizados"
    const soloNuevos = document.getElementById("botonMostrar").style.display === "block";
    if (soloNuevos) {
        mostrarJuegosDesdeMenuJuegos();
    }

    const checkboxes = document.querySelectorAll('#filtro-conexion input[name="conexion"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    const checkboxesgenero = document.querySelectorAll('#filtro-generos input[name="genero"]');
    checkboxesgenero.forEach(checkbox => {
        checkbox.checked = false;
    });
    aplicarFiltrosCombinados();
}

// Variables globales para controlar el intervalo y la posición
let animationInterval = null;
let pos = 0;
let isAnimating = false;

// Funcion para verificar si hay elementos en la lista de descartados
function hayDescartados() {
    const juegosdescartadosDiv = document.getElementById("juegosdescartados");
    const listaDescartados = juegosdescartadosDiv.querySelectorAll('li');
    juegosdescartadosDiv.style.display = listaDescartados.length > 0 ? "block" : "none";
}

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
    actualizarPrecioYTamano();
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
    actualizarPrecioYTamano();
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
    actualizarPrecioYTamano();
}

// Función para borrar todos los elementos de resultadosDiv y moverlos a juegosdescartadosDiv
function eliminarTodo() {
    const resultadosDiv = document.getElementById("resultados");
    const items = Array.from(resultadosDiv.querySelectorAll('li'));

    items.forEach(item => {
        devolverProducto(item); // Reutilizamos la función para asegurar la lógica consistente
    });
    hayDescartados();
    actualizarPrecioYTamano();
}

// Función para actualizar el precio y tamaño totales
function actualizarPrecioYTamano() {
    const resultadosDiv = document.getElementById("resultados");
    const calculoprecio = document.getElementById("calculoprecio");
    const items = resultadosDiv.querySelectorAll('li');
    let PrecioTotal = 0;
    let TamanoTotal = 0;

    items.forEach(item => {
        const precio = parseFloat(item.getAttribute("Precio"));
        const tamano = parseFloat(item.getAttribute("Tamano"));
        if (!isNaN(precio)) PrecioTotal += precio;
        if (!isNaN(tamano)) TamanoTotal += tamano;
    });

    // Calcular el regalo (si aplica)
    let textoRegalo = "";
    if (PrecioTotal >= 500) {
        const cantidadDe500 = Math.floor(PrecioTotal / 500);
        const regalo = cantidadDe500 * 100;
        textoRegalo = ` (${regalo} CUP de regalo disponibles)`;
        calculoprecio.textContent = "Precio y tamaño totales: " + PrecioTotal + " CUP; " + TamanoTotal.toFixed(2) + " GB" + textoRegalo;
    }

    else {
        calculoprecio.textContent = "Precio y tamaño totales: " + PrecioTotal + " CUP; " + TamanoTotal.toFixed(2) + " GB";
    }

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

// Función para establecer la búsqueda
function busqueda() {
    const maxPrice = parseFloat(document.getElementById("buscarprecio").value);
    const filtroNombre = document.getElementById("buscarnombre").value.toLowerCase();
    const grupos = document.querySelectorAll('.grupo-juegos');
    const text = document.getElementById("texto");
    let calculoprecio = document.getElementById("calculoprecio");
    let hayResultados = false;
    const botonborrarbusqueda = document.getElementById('botonborrarbusqueda');
    const botonborrarprecio = document.getElementById('botonborrarprecio');
    const divJuegos = document.getElementById("divJuegos");

    // Mostrar u ocultar los botones de limpieza de búsqueda según corresponda
    botonborrarbusqueda.style.display = filtroNombre ? "inline-block" : "none";
    botonborrarprecio.style.display = isNaN(maxPrice) ? "none" : "inline-block";

    grupos.forEach((grupo) => {
        const productos = grupo.querySelectorAll('.listajuegos li');
        let mostrarGrupo = false;

        productos.forEach((producto) => {
            // Desmarcar automáticamente todos los checkboxes de conexión y género antes de recorrer la lista de juegos
            const checkboxes = document.querySelectorAll('#filtro-conexion input[name="conexion"]');
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
            });

            const checkboxesgenero = document.querySelectorAll('#filtro-generos input[name="genero"]');
            checkboxesgenero.forEach(checkbox => {
                checkbox.checked = false;
            });
            // Verificar si hay una imagen con el atributo title o solo un enlace
            const productNameFromImg = producto.querySelector('img')?.getAttribute("title").toLowerCase();
            const productNameFromLink = producto.querySelector('a')?.textContent.trim().toLowerCase();

            // Si hay un título en la imagen, usa eso, si no, usa el texto del enlace
            const productName = productNameFromImg ? productNameFromImg :
                (productNameFromLink ? productNameFromLink : "");

            const productPrice = parseFloat(producto.getAttribute("Precio"));
            let mostrarProducto = true;

            // Filtrar por precio
            if (!isNaN(maxPrice)) {
                if (isNaN(productPrice)) {
                    mostrarProducto = false;
                } else if (productPrice > maxPrice) {
                    mostrarProducto = false;
                }
            }

            // Filtrar por nombre
            if (filtroNombre !== "" && !productName.includes(filtroNombre)) {
                mostrarProducto = false;
            }

            producto.style.display = mostrarProducto ? "list-item" : "none";

            if (mostrarProducto) {
                mostrarGrupo = true;
                hayResultados = true;
            }
        });

        // Ocultar/mostrar el encabezado de la sección según si hay resultados
        const encabezado = grupo.querySelector('.encabezadosjuegos');
        if (encabezado) {
            encabezado.style.display = mostrarGrupo ? "block" : "none";
        }

        grupo.style.display = mostrarGrupo ? "block" : "none";
    });

    // Mostrar mensaje si no hay resultados
    divJuegos.style.display = hayResultados ? 'block' : 'none';
    text.style.display = hayResultados ? 'none' : 'flex';
    if (!hayResultados) {
        text.textContent = "No hay resultados que coincidan con la búsqueda.";
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
function borrarPrecio() {
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
    const divJuegos = document.getElementById("divJuegos");
    let hayResultados = false;
    const encabezado = document.getElementById("EncabezadoJnewAct");
    encabezado.style.display = "block";

    // Desmarcar automáticamente todos los checkboxes de conexión
    desmarcarCheckboxes()

    // Primero ocultar todos los encabezados y grupos
    encabezadosJuegos.forEach(encabezado => encabezado.style.display = "none");
    grupos.forEach(grupo => grupo.style.display = "none");

    // Procesar cada grupo
    grupos.forEach((grupo) => {
        const productos = grupo.querySelectorAll('.listajuegos li');
        let mostrarGrupo = false;

        // Verificar si hay juegos nuevos/actualizados en este grupo
        productos.forEach((producto) => {
            if (producto.classList.contains('juegosNuevos') || producto.classList.contains('juegosActualizados')) {
                producto.style.display = "list-item";
                mostrarGrupo = true;
                hayResultados = true;
            } else {
                producto.style.display = "none";
            }
        });

        // Si el grupo tiene juegos para mostrar
        if (mostrarGrupo) {
            grupo.style.display = "block";
            // Mostrar el encabezado que está dentro del mismo section
            const encabezado = grupo.querySelector('.encabezadosjuegos');
            if (encabezado) {
                encabezado.style.display = "block";
            }
        }
    });

    divBusqueda.style.scale = "0";

    text.style.display = hayResultados ? 'none' : 'flex';
    divJuegos.style.display = hayResultados ? 'block' : 'none';

    if (!hayResultados) {
        const text = document.getElementById("texto");
        text.textContent = "No hay juegos nuevos o actualizados en esta sección.";
        encabezado.style.display = "none";
    }

    botonJNA.style.display = "none";
    botonMostrar.style.display = "block";

}
//Función para mostrar todos los juegos de nuevo
function mostrarJuegos() {
    const grupos = document.querySelectorAll('.grupo-juegos');
    const botonJNA = document.getElementById("botonJNA");
    const botonMostrar = document.getElementById("botonMostrar");
    const encabezadosJuegos = document.querySelectorAll('.encabezadosjuegos');
    const divBusqueda = document.getElementById("buscar");
    const encabezado = document.getElementById("EncabezadoJnewAct");
    encabezado.style.display = "none";

    // Desmarcar automáticamente todos los checkboxes de conexión
    desmarcarCheckboxes()

    grupos.forEach((grupo) => {
        const productos = grupo.querySelectorAll('.listajuegos li');
        productos.forEach((producto) => {
            producto.style.display = "list-item";
        });
    });

    encabezadosJuegos.forEach((encabezadoJuego) => {
        encabezadoJuego.style.display = "block";
    });


    divBusqueda.style.scale = "1";
    botonMostrar.style.display = "none";
    botonJNA.style.display = "block";

    // Forzar actualización de filtros
    aplicarFiltrosCombinados();
}
//Mostrar todos los juegos desde el menú de juegos en caso de que esté activado el modo solo nuevos/actualizados
function mostrarJuegosDesdeMenuJuegos() {
    const grupos = document.querySelectorAll('.grupo-juegos');
    const botonJNA = document.getElementById("botonJNA");
    const botonMostrar = document.getElementById("botonMostrar");
    const encabezadosJuegos = document.querySelectorAll('.encabezadosjuegos');
    const divBusqueda = document.getElementById("buscar");
    const encabezado = document.getElementById("EncabezadoJnewAct");
    encabezado.style.display = "none";

    grupos.forEach((grupo) => {
        const productos = grupo.querySelectorAll('.listajuegos li');
        productos.forEach((producto) => {
            producto.style.display = "list-item";
        });
    });

    encabezadosJuegos.forEach((encabezadoJuego) => {
        encabezadoJuego.style.display = "block";
    });


    divBusqueda.style.scale = "1";
    botonMostrar.style.display = "none";
    botonJNA.style.display = "block";
}

//Función para mostrar el Menú Desplegable
function mostrarMenu() {
    const menuDesplegado = document.getElementById("menuDesplegado");
    menuDesplegado.style.display = "block";
    const botonMenuDesplegable = document.getElementById("botonMenuDesplegable");
    botonMenuDesplegable.style.display = "none";
    const botonMenuDesplegable2 = document.getElementById("botonMenuDesplegable2");
    botonMenuDesplegable2.style.display = "block";
    const botonesMenuDesplegado = document.querySelectorAll('#menuDesplegado a');
    botonesMenuDesplegado.forEach(botonMenu => {
        botonMenu.addEventListener('click', function () {
            cerrarMenu();
        })
    })
}

//Función para cerrar el Menú Desplegable
function cerrarMenu() {
    const menuDesplegado = document.getElementById("menuDesplegado");
    const botonMenuDesplegable = document.getElementById("botonMenuDesplegable");
    botonMenuDesplegable.style.display = "block";
    const botonMenuDesplegable2 = document.getElementById("botonMenuDesplegable2");
    botonMenuDesplegable2.style.display = "none";
    menuDesplegado.style.display = "none";
}

//Función para enviar el listado de juegos agregados por Whatsapp
function enviarListado() {
    const resultadosDiv = document.getElementById("resultados");
    const items = resultadosDiv.querySelectorAll('li');
    let PrecioTotal = 0;
    let TamanoTotal = 0;
    let mensaje = "Hola! Le escribo para solicitar los siguientes juegos:\n";

    items.forEach(item => {
        // Obtener el precio y tamaño del juego
        const precio = parseFloat(item.getAttribute("Precio"));
        const tamano = parseFloat(item.getAttribute("Tamano"));

        if (!isNaN(precio)) PrecioTotal += precio;
        if (!isNaN(tamano)) TamanoTotal += tamano;

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
            mensaje += tituloJuego + "\n" + "\n";
        }
    });

    // Calcular el regalo (si aplica)
    let textoRegalo = "";
    if (PrecioTotal >= 500) {
        const cantidadDe500 = Math.floor(PrecioTotal / 500);
        const regalo = cantidadDe500 * 100;
        textoRegalo = ` (${regalo} CUP de regalo disponibles)`;
        // Agregar el precio total al mensaje
        mensaje += "Precio y tamaño totales: " + PrecioTotal + " CUP; " + TamanoTotal.toFixed(2) + " GB" + textoRegalo;
    }

    else {
        mensaje += "Precio y tamaño totales: " + PrecioTotal + " CUP; " + TamanoTotal.toFixed(2) + " GB";
    }

    // Codificar el mensaje para formato URL
    let mensajeURL = encodeURIComponent(mensaje);
    let URL = `https://wa.me/+5363975093?text=${mensajeURL}`;

    // Abrir la URL en una nueva pestaña
    window.open(URL, "_blank");
}

// Función para cambiar la vista de imágenes a texto
function cambiarVista() {
    const textoBoton = document.getElementById('botonCambiarVista');
    if (textoBoton.textContent === "Cambiar vista (Texto)") {
        textoBoton.textContent = "Cambiar vista (Imágenes)";
    }
    else {
        textoBoton.textContent = "Cambiar vista (Texto)";
    }
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
        const addButton = crearBoton("+", "add-button", "blue", function () {
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

    const removeButton = crearBoton("x", "remove-button", "red", function () {
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

    const addButton = crearBoton("+", "add-button", "blue", function () {
        moverProducto(producto);
    });
    producto.appendChild(addButton);
}

//Funciones para filtrar por tipo de conexión y género
function aplicarFiltrosCombinados() {
    const text = document.getElementById("texto");
    // 1. Obtener selecciones actuales
    const conexionesSeleccionadas = Array.from(
        document.querySelectorAll('#filtro-conexion input[name="conexion"]:checked')
    ).map(c => c.value.trim());

    const generosSeleccionados = Array.from(
        document.querySelectorAll('#filtro-generos input[name="genero"]:checked')
    ).map(g => g.value.trim());

    // 2. Determinar si estamos en modo "solo nuevos/actualizados"
    const soloNuevos = document.getElementById("botonMostrar").style.display === "block";

    // Variables para controlar si hay resultados
    let hayResultados = false;
    const divJuegos = document.getElementById("divJuegos");

    // 3. Aplicar filtros a cada juego
    document.querySelectorAll('.listajuegos li').forEach(juego => {
        // Filtro de nuevos/actualizados (prioritario)
        if (soloNuevos && !juego.classList.contains('juegosNuevos') && !juego.classList.contains('juegosActualizados')) {
            juego.style.display = 'none';
            return;
        }

        const conexionesJuego = (juego.getAttribute('Tconex') || '').split(',').map(c => c.trim());
        const generosJuego = (juego.getAttribute('Genero') || '').split(',').map(g => g.trim());

        // 4. Lógica de filtrado combinado (AND entre conexión y género)
        let mostrarJuego = true;

        // A. Filtro de conexión (solo si hay selección)
        if (conexionesSeleccionadas.length > 0) {
            const cumpleConexion = conexionesSeleccionadas.some(conexion =>
                conexionesJuego.includes(conexion)
            );
            mostrarJuego = mostrarJuego && cumpleConexion;
        }

        // B. Filtro de género (solo si hay selección)
        if (generosSeleccionados.length > 0) {
            const cumpleGenero = generosSeleccionados.some(genero =>
                generosJuego.includes(genero)
            );
            mostrarJuego = mostrarJuego && cumpleGenero;
        }

        // Respetar otros filtros (como búsqueda)
        mostrarJuego = mostrarJuego && !juego.dataset.forceHidden;

        // 5. Aplicar resultado
        juego.style.display = mostrarJuego ? 'list-item' : 'none';

        if (mostrarJuego) {
            hayResultados = true;
        }
    });

    // Manejar mensaje de "no hay resultados"
    divJuegos.style.display = hayResultados ? 'block' : 'none';
    text.style.display = hayResultados ? 'none' : 'flex';
    if (!hayResultados) {
        text.textContent = "No hay resultados que coincidan con los filtros aplicados.";
    }
    actualizarEncabezados();
}

function actualizarEncabezados() {
    document.querySelectorAll('.grupo-juegos').forEach(grupo => {
        const tieneJuegosVisibles = Array.from(grupo.querySelectorAll('.listajuegos li')).some(
            li => li.style.display !== 'none'
        );

        const encabezado = grupo.querySelector('.encabezadosjuegos');
        if (encabezado) {
            encabezado.style.display = tieneJuegosVisibles ? 'block' : 'none';
        }

        grupo.style.display = tieneJuegosVisibles ? 'block' : 'none';
    });
}

