// Crear los botones de adición automáticamente al cargar la página
document.addEventListener("DOMContentLoaded", function () {
  cargarImagenesLazy();
  crearBotonesAdicion();
  agregarTextoNuevoOActualizado();
  agregarIconosFiltrosAJuegos();
  agregarPreciosAJuegos();
  agregarListenersFiltros();
  agregarListenersImgBotonesMenu();
});

// Función para crear botones de adición
function crearBotonesAdicion() {
  document
    .querySelectorAll(
      ".listajuegos li:not(#resultados li):not(#juegosDescartados li):not(#regalos li)",
    )
    .forEach((producto) => {
      reconstruirBotonPrincipal(producto);
      reconstruirBotonRegalo(producto);
    });
}

// Añadir el texto de Nuevo o Actualizado a los juegos que lo sean
function agregarTextoNuevoOActualizado() {
  // Seleccionar los elementos li con las clases relevantes
  const elementosLi = document.querySelectorAll(
    "li.juegosNuevos, li.juegosActualizados",
  );

  elementosLi.forEach((li) => {
    const enlace = li.querySelector("a");
    if (!enlace) return; // Si no hay enlace, salir

    // Determinar si es "Nuevo" o "Actualizado" según la clase
    const texto = li.classList.contains("juegosNuevos")
      ? "(Nuevo)"
      : "(Actualizado)";

    // Crear un elemento <p> con un espacio no rompible y el texto
    const p = document.createElement("p");
    p.innerHTML = `&nbsp;${texto}`;

    // Insertar el <p> después del <a>
    enlace.parentNode.insertBefore(p, enlace.nextSibling);
  });
}

// Función para añadir iconos de conexión y género a cada juego
function agregarIconosFiltrosAJuegos() {
  document.querySelectorAll(".listajuegos li").forEach((li) => {
    // Eliminar contenedor de iconos existente si hay
    const iconosExistente = li.querySelector(".li-iconos-filtros");
    if (iconosExistente) {
      iconosExistente.remove();
    }

    // Obtener filtros juego
    const conexiones = (li.getAttribute("Tconex") || "")
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c !== "");

    const generos = (li.getAttribute("Genero") || "")
      .split(",")
      .map((g) => g.trim())
      .filter((g) => g !== "");
    let otrosFiltros = [];

    const clases = Array.from(li.classList);

    // MODS → detectar pocosMods o muchosMods
    if (clases.includes("pocosMods") || clases.includes("muchosMods")) {
      otrosFiltros.push("Contiene mods");
    }

    // Si tiene Servidor Dedicado (servidor)
    if (clases.includes("servidor")) {
      otrosFiltros.push("Contiene Servidor Dedicado");
    }

    // Si el juego no está probado (noProbado)
    if (clases.includes("noProbado")) {
      otrosFiltros.push("No probado");
    }

    // Crear contenedor de iconos solo si hay algo que mostrar
    if (
      conexiones.length > 0 ||
      generos.length > 0 ||
      otrosFiltros.length > 0
    ) {
      const iconosContainer = document.createElement("div");
      iconosContainer.className = "li-iconos-filtros";

      // Añadir clase adicional para juegos nuevos/actualizados
      if (
        li.classList.contains("juegosNuevos") ||
        li.classList.contains("juegosActualizados")
      ) {
        iconosContainer.classList.add("iconos-especiales");
      }

      // Añadir iconos de conexión
      conexiones.forEach((conexion) => {
        if (conexion) {
          const icono = document.createElement("img");
          icono.className = "li-icono-filtro";
          icono.src = `img/filtros/${conexion}.webp`;
          icono.alt = conexion;
          icono.title = conexion;
          iconosContainer.appendChild(icono);
        }
      });

      // Añadir iconos de género
      generos.forEach((genero) => {
        if (genero) {
          const icono = document.createElement("img");
          icono.className = "li-icono-filtro";
          icono.src = `img/filtros/${genero}.webp`;
          icono.alt = genero;
          icono.title = genero;
          iconosContainer.appendChild(icono);
        }
      });

      // Añadir iconos de los otros filtros
      otrosFiltros.forEach((otroFiltro) => {
        if (otroFiltro) {
          const icono = document.createElement("img");
          icono.className = "li-icono-filtro";
          icono.src = `img/filtros/${otroFiltro}.webp`;
          icono.alt = otroFiltro;
          icono.title = otroFiltro;
          iconosContainer.appendChild(icono);
        }
      });

      // Añadir iconos de activación si el juego lo requiere
      if (li.classList.contains("Activacion")) {
        const icono = document.createElement("img");
        icono.className = "li-icono-filtro";
        icono.src = "img/candado.webp";
        icono.alt = "Activación requerida";
        icono.title = "Activación requerida";
        iconosContainer.appendChild(icono);
      }

      // Añadir contenedor de iconos al li
      li.appendChild(iconosContainer);
    }
  });
}

// Configurar listeners para filtros de conexión y género
function agregarListenersFiltros() {
  document
    .querySelectorAll('#filtro-conexion input[type="checkbox"]')
    .forEach((checkbox) => {
      checkbox.addEventListener("change", function () {
        document.querySelectorAll(".listajuegos li").forEach((li) => {
          delete li.dataset.forceHidden;
        });
        aplicarFiltrosCombinados();
      });
    });

  document
    .querySelectorAll('#filtro-generos input[type="checkbox"]')
    .forEach((checkbox) => {
      checkbox.addEventListener("change", function () {
        document.querySelectorAll(".listajuegos li").forEach((li) => {
          delete li.dataset.forceHidden;
        });
        aplicarFiltrosCombinados();
      });
    });

  document
    .querySelectorAll('#otros-filtros input[type="checkbox"]')
    .forEach((checkbox) => {
      checkbox.addEventListener("change", function () {
        document.querySelectorAll(".listajuegos li").forEach((li) => {
          delete li.dataset.forceHidden;
        });
        aplicarFiltrosCombinados();
      });
    });
}

// Agregar los listeners a las imágenes de los botones del menú de juegos
function agregarListenersImgBotonesMenu() {
  document.querySelectorAll("#menuDesplegado a img").forEach((img) => {
    img.addEventListener("click", desmarcarCheckboxes);
  });
}

// Agregar los precios a cada juego ya sea en el atributo del li como en el de su img
function agregarPreciosAJuegos() {
  const juegos = document.querySelectorAll("li");
  juegos.forEach((juego) => {
    let precio = 0;
    if (juego.getAttribute("Precio")) {
      precio = juego.getAttribute("Precio");
    } else {
      if (juego.classList.contains("precio1")) precio += 50; // 0 GB Y <= 5 GB
      if (juego.classList.contains("precio2")) precio += 100; //+ 5 GB Y <= 10 GB
      if (juego.classList.contains("precio3")) precio += 200; // 10 GB Y <= 50 GB
      if (juego.classList.contains("precio4")) precio += 300; // + 50 GB Y <= 80 GB
      if (juego.classList.contains("precio5")) precio += 400; // + 80 GB
      if (juego.classList.contains("crack")) precio += 100;
      if (juego.classList.contains("pocosMods")) precio += 50;
      if (juego.classList.contains("muchosMods")) precio += 100;
      if (juego.classList.contains("servidor")) precio += 150;
      if (juego.classList.contains("Activacion")) precio += 1500;
      if (juego.classList.contains("consolas")) precio += 100;
      if (juego.classList.contains("Nswitch")) precio += 200;
    }
    agregarPrecioANombresJuegos(juego, precio);
    juego.setAttribute("Precio", precio);
  });
}

function agregarPrecioANombresJuegos(juego, precio) {
  let nombre = obtenerTituloJuego(juego);
  nombre += "- " + precio + " CUP";
  img = juego.querySelector("img");
  img.setAttribute("title", nombre);
}

// Escuchar el evento de scroll para mostrar el botón de desplazamiento
window.addEventListener("scroll", mostrarBoton);

function mostrarBoton() {
  const scrollButton = document.getElementById("botonArriba");
  const scrollPosition =
    document.documentElement.scrollTop || document.body.scrollTop;

  // Limpiar intervalo anterior si existe
  if (animationInterval) {
    clearInterval(animationInterval);
    isAnimating = false;
  }

  // Si el scroll es mayor a 800px, mostrar el botón con animación hacia arriba
  if (scrollPosition > 800) {
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
  // Si el scroll es menor a 800px, ocultar el botón con animación hacia abajo
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

// Desmarcar todos los checkboxes de los filtros de conexión y género
function desmarcarCheckboxes() {
  if (
    document.getElementById("botonJNA").classList.contains("BotonBolaVerde")
  ) {
    mostrarJuegosDesdeMenuJuegos();
  }

  const checkboxes = document.querySelectorAll(
    '#filtro-conexion input[name="conexion"]',
  );
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });

  const checkboxesgenero = document.querySelectorAll(
    '#filtro-generos input[name="genero"]',
  );
  checkboxesgenero.forEach((checkbox) => {
    checkbox.checked = false;
  });

  const otroscheckboxes = document.querySelectorAll(
    '#otros-filtros input[name="otros"]',
  );
  otroscheckboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });

  aplicarFiltrosCombinados();
  if (document.getElementById("menuDesplegado").style.display === "block") {
    borrarBusqueda();
    borrarPrecio();
  }
}

// Variables globales para controlar el intervalo y la posición
let animationInterval = null;
let pos = 0;
let isAnimating = false;

// Funcion para verificar si hay elementos en la lista de descartados
function hayDescartados() {
  const juegosDescartadosDiv = document.getElementById("juegosDescartados");
  const listaDescartados = juegosDescartadosDiv.querySelectorAll("li");
  juegosDescartadosDiv.style.display =
    listaDescartados.length > 0 ? "block" : "none";
}

// Event listener para detectar cuando el usuario modifica el precio
document.getElementById("buscarPrecio").addEventListener("input", function () {
  // Si el usuario modifica el precio, resetear a verde
  this.classList.remove("amarillo", "rojo");
});

// Función para agregar un producto al div de resultados
function agregarProducto(producto) {
  const resultadosDiv = document.getElementById("resultados");
  const listaResultados = resultadosDiv.querySelector("ul:first-of-type");

  // Eliminar botones existentes
  const addButton = producto.querySelector(".add-button");
  const regaloButton = producto.querySelector(".regalo-button");
  if (addButton) addButton.remove();
  if (regaloButton) regaloButton.remove();

  // Reconstruir botones para resultados
  reconstruirBotonResultado(producto);
  reconstruirBotonRegalo(producto);

  listaResultados.appendChild(producto);

  ordenarListaAlfabeticamente(listaResultados);
  hayDescartados();
  actualizarPrecioYTamano();

  // Si se mueve (selecciona) alguno de los títulos nuevos o actualizados cuando solo se muestran estos, asegurar que se sigan mostrando
  if (
    document.getElementById("botonJNA").classList.contains("BotonBolaVerde")
  ) {
    mostrarJuegosNewOrAct();
  } else {
    busqueda();
  }
}

/**
 * Función para agregar un juego como regalo con validación
 */
function agregarComoRegalo(producto) {
  const resultadosDiv = document.getElementById("resultados");
  const items = resultadosDiv.querySelectorAll("li:not(#regalos li)");
  let PrecioJuegos = 0;

  if (producto.classList.contains("Activacion")) {
    alert("Los juegos por Activación no pueden ser seleccionados como regalo");
    return;
  }

  // Calcular precio total de juegos (excluyendo activaciones)
  items.forEach((item) => {
    const precio = parseFloat(item.getAttribute("Precio"));
    if (!isNaN(precio) && !item.classList.contains("Activacion")) {
      PrecioJuegos += precio;
    }
  });

  // Validar si cumple con el requisito de 500 CUP
  if (PrecioJuegos < 500) {
    alert(
      `Para poder agregar regalos necesita al menos un total de 500 CUP en los juegos que seleccione.\nActualmente tiene un total de: ${PrecioJuegos} CUP en dichos juegos`,
    );
    return;
  }

  // Calcular bono de regalo disponible
  const cantidadDe500 = Math.floor(PrecioJuegos / 500);
  const bonoDisponible = cantidadDe500 * 150;

  // Calcular bono ya utilizado
  const regalosDiv = document.getElementById("regalos");
  const regalosActuales = regalosDiv.querySelectorAll("li");
  let bonoUtilizado = 0;

  regalosActuales.forEach((regalo) => {
    const precioRegalo = parseFloat(regalo.getAttribute("Precio"));
    if (!isNaN(precioRegalo)) {
      bonoUtilizado += precioRegalo;
    }
  });

  const bonoRestante = bonoDisponible - bonoUtilizado;

  // Obtener precio del juego que se quiere agregar
  const precioJuego = parseFloat(producto.getAttribute("Precio"));

  // Validar que el juego no supere el bono restante
  if (precioJuego > bonoRestante) {
    alert(
      `No puede agregar este juego como regalo porque supera el bono disponible.\n\n` +
        `Bono disponible: ${bonoDisponible} CUP\n` +
        `Bono utilizado: ${bonoUtilizado} CUP\n` +
        `Bono restante: ${bonoRestante} CUP\n` +
        `Precio del juego: ${precioJuego} CUP\n\n` +
        `Seleccione un juego de menor precio o elimine algunos regalos actuales.`,
    );
    return;
  }

  // Si cumple todos los requisitos, agregar como regalo
  agregarRegalo(producto);
}

// Función para agregar un producto al div de regalos
function agregarRegalo(producto) {
  const regalosDiv = document.getElementById("regalos");
  const listaRegalos = regalosDiv.querySelector("ul");
  const calculoPrecio = document.getElementById("calculoPrecio");

  listaRegalos.style.display = "flex";
  calculoPrecio.style.display = "block";
  regalosDiv.style.display = "block";

  // Eliminar botones existentes
  const regaloButton = producto.querySelector(".regalo-button");
  if (regaloButton) regaloButton.remove();

  // Crear botón de añadir
  if (!producto.querySelector(".add-button")) {
    const addButton = crearBoton("🛒", "add-button", "blue", function () {
      agregarProducto(producto);
    });
    producto.appendChild(addButton);
  }

  // Crear botón de eliminar
  if (!producto.querySelector(".remove-button")) {
    const removeButton = crearBoton("🗑️", "remove-button", "red", function () {
      eliminarRegalo(producto);
    });
    producto.appendChild(removeButton);
  }

  listaRegalos.appendChild(producto);
  hayDescartados();
  ordenarListaAlfabeticamente(listaRegalos);
  actualizarPrecioYTamano();

  // Si se mueve (selecciona) alguno de los títulos nuevos o actualizados cuando solo se muestran estos, asegurar que se sigan mostrando
  if (
    document.getElementById("botonJNA").classList.contains("BotonBolaVerde")
  ) {
    mostrarJuegosNewOrAct();
  } else {
    busqueda();
  }
}

// Función para devolver un producto a juegosDescartadosDiv
function devolverProducto(producto) {
  const juegosDescartadosDiv = document.getElementById("juegosDescartados");
  const listaDescartados = juegosDescartadosDiv.querySelector("ul");

  // Eliminar botón de eliminar si existe
  const removeButton = producto.querySelector(".remove-button");
  if (removeButton) removeButton.remove();

  // Mover el producto primero
  listaDescartados.appendChild(producto);

  // Reconstruir botones
  reconstruirBotonDescartado(producto);
  reconstruirBotonRegalo(producto);

  ordenarListaAlfabeticamente(listaDescartados);
  hayDescartados();
  actualizarPrecioYTamano();
}

function eliminarRegalo(producto) {
  const juegosDescartadosDiv = document.getElementById("juegosDescartados");
  const listaDescartados = juegosDescartadosDiv.querySelector("ul");

  // Eliminar botón de eliminar del regalo
  const removeButton = producto.querySelector(".remove-button");
  if (removeButton) removeButton.remove();

  // Mover el producto primero (sacar de #regalos)
  listaDescartados.appendChild(producto);

  // Reconstruir botones normales para descartados (ahora closest('#regalos') dará false)
  reconstruirBotonDescartado(producto);
  reconstruirBotonRegalo(producto);

  ordenarListaAlfabeticamente(listaDescartados);
  hayDescartados();
  actualizarPrecioYTamano();

  // Verificar si quedan regalos después de eliminar este
  verificarVisibilidadRegalos();
}

// Función para mover todos los elementos de juegosDescartadosDiv a resultadosDiv
function agregarTodo() {
  const juegosDescartadosDiv = document.getElementById("juegosDescartados");
  const items = Array.from(juegosDescartadosDiv.querySelectorAll("li"));

  items.forEach((item) => {
    agregarProducto(item); // Reutilizamos la función para asegurar la lógica consistente
  });
  juegosDescartadosDiv.style.display = "none";
  actualizarPrecioYTamano();
}

// Función para borrar todos los elementos de resultadosDiv y moverlos a juegosDescartadosDiv
function eliminarTodo() {
  const resultadosDiv = document.getElementById("resultados");
  const items = Array.from(resultadosDiv.querySelectorAll("li"));

  items.forEach((item) => {
    devolverProducto(item);
  });
  hayDescartados();
  actualizarPrecioYTamano();
}

// Función para eliminar todos los regalos y enviarlos a juegosDescartados
function eliminarRegalos() {
  const regalosDiv = document.getElementById("regalos");
  const listaRegalos = regalosDiv.querySelector("ul");
  const regalos = Array.from(listaRegalos.querySelectorAll("li"));

  if (regalos.length === 0) {
    return; // No hay regalos para eliminar
  }

  regalos.forEach((regalo) => {
    eliminarRegalo(regalo);
  });

  // Ocultar la sección de regalos después de eliminar todos
  regalosDiv.style.display = "none";
}

// Función para verificar y actualizar la visibilidad del contenedor de regalos
function verificarVisibilidadRegalos() {
  const regalosDiv = document.getElementById("regalos");
  const listaRegalos = regalosDiv.querySelector("ul");
  const regalos = listaRegalos.querySelectorAll("li");
  const calculoPrecio = document.getElementById("calculoPrecio");

  if (regalos.length === 0) {
    regalosDiv.style.display = "none";
    // Ocultar también el cálculo de precio si no hay juegos seleccionados
    const items = document.querySelectorAll("#resultados > ul li");
    if (items.length === 0) {
      calculoPrecio.style.display = "none";
    }
  } else {
    regalosDiv.style.display = "block";
    calculoPrecio.style.display = "block";
  }
}

// Función para actualizar el precio y tamaño totales
function actualizarPrecioYTamano() {
  const resultadosDiv = document.getElementById("resultados");
  const regalosDiv = document.getElementById("regalos");
  const calculoPrecio = document.getElementById("calculoPrecio");

  // Obtener juegos normales (excluyendo regalos)
  const items = document.querySelectorAll("#resultados > ul li");

  // Obtener regalos
  const regalos = regalosDiv.querySelectorAll("li");

  let PrecioJuegos = 0;
  let PrecioActivaciones = 0;
  let PrecioTotal = 0;
  let TamanoTotal = 0;

  // Hallar el total de precios y tamaños de los juegos seleccionados
  items.forEach((item) => {
    const precio = parseFloat(item.getAttribute("Precio"));
    const tamano = parseFloat(item.getAttribute("Tamano"));
    if (!isNaN(precio) && item.classList.contains("Activacion"))
      PrecioActivaciones += precio;
    else if (!isNaN(precio)) PrecioJuegos += precio;
    if (!isNaN(tamano)) TamanoTotal += tamano;
  });

  // Hallar tamaño de los regalos y calcular bono utilizado
  let bonoUtilizado = 0;
  regalos.forEach((regalo) => {
    const tamano = parseFloat(regalo.getAttribute("Tamano"));
    const precio = parseFloat(regalo.getAttribute("Precio"));
    if (!isNaN(tamano)) TamanoTotal += tamano;
    if (!isNaN(precio)) bonoUtilizado += precio;
  });

  PrecioTotal = PrecioJuegos + PrecioActivaciones;

  // Calcular el regalo (si aplica)
  let textoRegalo = "";
  if (PrecioJuegos >= 500) {
    const cantidadDe500 = Math.floor(PrecioJuegos / 500);
    const bonoDisponible = cantidadDe500 * 150;
    const bonoRestante = bonoDisponible - bonoUtilizado;

    textoRegalo = ` + ${bonoDisponible} CUP de regalo (${bonoUtilizado} CUP usados y ${bonoRestante} CUP restantes)`;
    calculoPrecio.textContent =
      "Precio y tamaño totales: " +
      PrecioTotal +
      " CUP; " +
      TamanoTotal.toFixed(2) +
      " GB" +
      textoRegalo;
  } else {
    calculoPrecio.textContent =
      "Precio y tamaño totales: " +
      PrecioTotal +
      " CUP; " +
      TamanoTotal.toFixed(2) +
      " GB";
    eliminarRegalos(); // Eliminar todos los regalos que estén seleccionados si se quitan juegos del carrito
  }

  resultadosDiv.style.display = items.length > 0 ? "block" : "none";
  calculoPrecio.style.display = items.length > 0 ? "block" : "none";

  // Verificar visibilidad de regalos
  verificarVisibilidadRegalos();
}

// Función para ordenar alfabéticamente una lista
function ordenarListaAlfabeticamente(lista) {
  const items = Array.from(lista.querySelectorAll("li"));

  items.sort((a, b) => {
    // Obtener el título del juego de manera consistente, independientemente del modo de visualización
    const textA = obtenerTituloJuego(a).toLowerCase();
    const textB = obtenerTituloJuego(b).toLowerCase();
    return textA.localeCompare(textB);
  });

  lista.innerHTML = ""; // Vaciar la lista
  items.forEach((item) => lista.appendChild(item));
}

// Función para obtener el título del juego de manera consistente, independientemente del modo de visualización
function obtenerTituloJuego(item) {
  // Si está en modo tradicional, obtener el texto del enlace o del li
  if (document.body.classList.contains("vista-tradicional")) {
    const enlace = item.querySelector("a");
    return enlace ? enlace.textContent.trim() : item.textContent.trim();
  } else {
    // En modo imágenes, obtener el título de la imagen
    const img = item.querySelector("img");
    return img ? img.getAttribute("title").trim() : item.textContent.trim();
  }
}

// Función para crear un botón con propiedades
function crearBoton(text, className, color, onClick) {
  const button = document.createElement("button");
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
  const maxPrice = parseFloat(document.getElementById("buscarPrecio").value);
  const filtroNombre = document
    .getElementById("buscarNombre")
    .value.toLowerCase();
  const grupos = document.querySelectorAll(".grupo-juegos");
  const text = document.getElementById("texto");
  const calculoPrecio = document.getElementById("calculoPrecio");
  const botonBorrarBusqueda = document.getElementById("botonBorrarBusqueda");
  const botonBorrarPrecio = document.getElementById("botonBorrarPrecio");
  const divJuegos = document.getElementById("divJuegos");

  // Mostrar u ocultar botones de limpieza
  botonBorrarBusqueda.style.display = filtroNombre ? "inline-block" : "none";
  botonBorrarPrecio.style.display = isNaN(maxPrice) ? "none" : "inline-block";

  // Solo desmarcar checkboxes si hay texto de búsqueda por nombre y no solamente por precio
  if (filtroNombre !== "") {
    document
      .querySelectorAll('#filtro-conexion input[name="conexion"]')
      .forEach((cb) => (cb.checked = false));
    document
      .querySelectorAll('#filtro-generos input[name="genero"]')
      .forEach((cb) => (cb.checked = false));
    document
      .querySelectorAll('#otros-filtros input[name="otros"]')
      .forEach((cb) => (cb.checked = false));
  }

  // Obtener filtros activos para combinarlos con la búsqueda
  const conexionesSeleccionadas = Array.from(
    document.querySelectorAll(
      '#filtro-conexion input[name="conexion"]:checked',
    ),
  ).map((c) => c.value.trim());

  const generosSeleccionados = Array.from(
    document.querySelectorAll('#filtro-generos input[name="genero"]:checked'),
  ).map((g) => g.value.trim());

  const otrosFiltros = Array.from(
    document.querySelectorAll('#otros-filtros input[name="otros"]:checked'),
  ).map((h) => h.value.trim());

  const soloNuevos = document
    .getElementById("botonJNA")
    .classList.contains("BotonBolaVerde");

  let hayResultados = false;

  grupos.forEach((grupo) => {
    const productos = grupo.querySelectorAll(".listajuegos li");
    let mostrarGrupo = false;

    productos.forEach((producto) => {
      const productName = obtenerTituloJuego(producto).toLowerCase();
      const productPrice = parseFloat(producto.getAttribute("Precio"));
      let mostrar = true;

      // Filtro de modo "solo nuevos/actualizados"
      if (
        soloNuevos &&
        !producto.classList.contains("juegosNuevos") &&
        !producto.classList.contains("juegosActualizados")
      ) {
        mostrar = false;
      }

      // Filtro de precio
      if (!isNaN(maxPrice) && !isNaN(productPrice) && productPrice > maxPrice) {
        mostrar = false;
      }

      // Filtro de nombre
      if (filtroNombre !== "" && !productName.includes(filtroNombre)) {
        mostrar = false;
      }

      // Filtro de conexión y género (combinado)
      if (mostrar && conexionesSeleccionadas.length > 0) {
        const conexionesJuego = (producto.getAttribute("Tconex") || "")
          .split(",")
          .map((c) => c.trim());
        mostrar = conexionesSeleccionadas.some((c) =>
          conexionesJuego.includes(c),
        );
      }

      if (mostrar && generosSeleccionados.length > 0) {
        const generosJuego = (producto.getAttribute("Genero") || "")
          .split(",")
          .map((g) => g.trim());
        mostrar = generosSeleccionados.some((g) => generosJuego.includes(g));
      }

        if (mostrar && otrosFiltros.length > 0) {
          const clasesJuego = Array.from(producto.classList);

          // Convertir el filtro "Mods" → coincidir con pocosMods o muchosMods
          const coincideMods =
            otrosFiltros.includes("Mods") &&
            (clasesJuego.includes("pocosMods") ||
              clasesJuego.includes("muchosMods"));

          // Coincidencia directa con clases como "servidor" o "noProbado"
          const coincidenciaDirecta = otrosFiltros.some((f) =>
            clasesJuego.includes(f) || productName.includes("servidor"),
          );

          if (!coincideMods && !coincidenciaDirecta) {
            mostrar = false;
          }
        }

      producto.style.display = mostrar ? "list-item" : "none";
      if (mostrar) {
        mostrarGrupo = true;
        hayResultados = true;
      }
    });

    const encabezado = grupo.querySelector(".encabezadosjuegos");
    if (encabezado) encabezado.style.display = mostrarGrupo ? "block" : "none";
    grupo.style.display = mostrarGrupo ? "block" : "none";
  });

  // Mostrar mensaje si no hay resultados
  divJuegos.style.display = hayResultados ? "block" : "none";
  text.style.display = hayResultados ? "none" : "flex";
  if (!hayResultados)
    text.textContent = "No hay resultados que coincidan con la búsqueda.";

  // Mostrar u ocultar el cálculo de precio
  if (calculoPrecio.textContent.trim() !== "") {
    calculoPrecio.style.display = "block";
  }
}

// Función para borrar el campo de búsqueda
function borrarBusqueda() {
  const buscarNombreInput = document.getElementById("buscarNombre");
  // Limpiar el campo de texto
  buscarNombreInput.value = "";
  busqueda();
}
// Función para borrar el campo de precio
function borrarPrecio() {
  const filtroprecioInput = document.getElementById("buscarPrecio");
  filtroprecioInput.value = "";

  // Si hay búsqueda por nombre, vuelve a ejecutar búsqueda completa
  const filtroNombre = document.getElementById("buscarNombre").value.trim();
  if (filtroNombre !== "") {
    busqueda();
  } else {
    // Si no hay búsqueda por nombre, mantener filtros combinados activos
    aplicarFiltrosCombinados();
  }

  // Ocultar el botón de borrar precio
  document.getElementById("botonBorrarPrecio").style.display = "none";
}

// Funciones para mostrar solo los titulos nuevos o actualizados

// Programar los eventos del botónJNA sobre la clase BotonBolaVerde
document.getElementById("botonJNA").addEventListener("click", () => {
  if (
    document.getElementById("botonJNA").classList.contains("BotonBolaVerde")
  ) {
    mostrarJuegos(); // Volver a mostrar todo
  } else {
    mostrarJuegosNewOrAct(); // Mostrar solo nuevos/actualizados
  }
});

// Resto de la lógica
function mostrarJuegosNewOrAct() {
  borrarBusqueda();
  borrarPrecio();
  const grupos = document.querySelectorAll(".grupo-juegos");
  const botonJNA = document.getElementById("botonJNA");
  const encabezadosJuegos = document.querySelectorAll(".encabezadosjuegos");
  const text = document.getElementById("texto");
  const divJuegos = document.getElementById("divJuegos");
  let hayResultados = false;
  const encabezado = document.getElementById("EncabezadoJnewAct");
  encabezado.classList.add("mostrar");

  // Desmarcar automáticamente todos los checkboxes de conexión
  desmarcarCheckboxes();

  // Primero ocultar todos los encabezados y grupos
  encabezadosJuegos.forEach(
    (encabezado) => (encabezado.style.display = "none"),
  );
  grupos.forEach((grupo) => (grupo.style.display = "none"));

  // Procesar cada grupo
  grupos.forEach((grupo) => {
    const productos = grupo.querySelectorAll(".listajuegos li");
    let mostrarGrupo = false;

    // Verificar si hay juegos nuevos/actualizados en este grupo
    productos.forEach((producto) => {
      if (
        producto.classList.contains("juegosNuevos") ||
        producto.classList.contains("juegosActualizados")
      ) {
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
      const encabezado = grupo.querySelector(".encabezadosjuegos");
      if (encabezado) {
        encabezado.style.display = "block";
      }
    }
  });

  text.style.display = hayResultados ? "none" : "flex";
  divJuegos.style.display = hayResultados ? "block" : "none";

  if (!hayResultados) {
    const text = document.getElementById("texto");
    text.textContent = "No hay juegos nuevos o actualizados en esta sección.";
    encabezado.classList.remove("mostrar");
  }

  // Marcar botón como activo
  botonJNA.classList.add("BotonBolaVerde");
}
// Función para mostrar todos los juegos de nuevo
function mostrarJuegos() {
  const grupos = document.querySelectorAll(".grupo-juegos");
  const botonJNA = document.getElementById("botonJNA");
  const encabezadosJuegos = document.querySelectorAll(".encabezadosjuegos");
  const encabezado = document.getElementById("EncabezadoJnewAct");
  encabezado.classList.remove("mostrar");

  // Desmarcar automáticamente todos los checkboxes de conexión
  desmarcarCheckboxes();

  grupos.forEach((grupo) => {
    const productos = grupo.querySelectorAll(".listajuegos li");
    productos.forEach((producto) => {
      producto.style.display = "list-item";
    });
  });

  encabezadosJuegos.forEach((encabezadoJuego) => {
    encabezadoJuego.style.display = "block";
  });

  // Quitar estado de activo
  botonJNA.classList.remove("BotonBolaVerde");

  // Forzar actualización de filtros
  aplicarFiltrosCombinados();
}
// Mostrar todos los juegos desde el menú de juegos en caso de que esté activado el modo solo nuevos/actualizados
function mostrarJuegosDesdeMenuJuegos() {
  const grupos = document.querySelectorAll(".grupo-juegos");
  const botonJNA = document.getElementById("botonJNA");
  const encabezadosJuegos = document.querySelectorAll(".encabezadosjuegos");
  const encabezado = document.getElementById("EncabezadoJnewAct");
  encabezado.classList.remove("mostrar");

  grupos.forEach((grupo) => {
    const productos = grupo.querySelectorAll(".listajuegos li");
    productos.forEach((producto) => {
      producto.style.display = "list-item";
    });
  });

  encabezadosJuegos.forEach((encabezadoJuego) => {
    encabezadoJuego.style.display = "block";
  });

  botonJNA.classList.remove("BotonBolaVerde");
}

// Función para mostrar el Menú Desplegable
function mostrarMenu() {
  const menuDesplegado = document.getElementById("menuDesplegado");
  menuDesplegado.style.display = "block";
  const botonMenuDesplegable = document.getElementById("botonMenuDesplegable");
  botonMenuDesplegable.addEventListener("click", cerrarMenu);
  botonMenuDesplegable.style.borderTopLeftRadius = "50px";
  botonMenuDesplegable.style.borderBottomLeftRadius = "50px";
  const botonesMenuDesplegado = document.querySelectorAll("#menuDesplegado a");
  botonesMenuDesplegado.forEach((botonMenu) => {
    botonMenu.addEventListener("click", function () {
      cerrarMenu();
    });
  });
}

// Función para cerrar el Menú Desplegable
function cerrarMenu() {
  const menuDesplegado = document.getElementById("menuDesplegado");
  const botonMenuDesplegable = document.getElementById("botonMenuDesplegable");
  botonMenuDesplegable.removeEventListener("click", cerrarMenu);
  botonMenuDesplegable.addEventListener("click", mostrarMenu);
  botonMenuDesplegable.style.borderRadius = "50px";
  menuDesplegado.style.display = "none";
}

// Función para enviar el listado de juegos agregados por Whatsapp
function enviarListado() {
  const regalosDiv = document.getElementById("regalos");

  // Obtener juegos normales (excluyendo regalos)
  const items = document.querySelectorAll("#resultados > ul li");

  // Obtener regalos
  const regalos = regalosDiv.querySelectorAll("li");

  let CantTotalJuegos = items.length + regalos.length;
  let PrecioJuegos = 0;
  let PrecioActivaciones = 0;
  let PrecioTotal = 0;
  let TamanoTotal = 0;

  let mensaje =
    CantTotalJuegos > 1
      ? "Hola! Le escribo para solicitar los siguientes " +
        CantTotalJuegos +
        " juegos:\n"
      : "Hola! Le escribo para solicitar el siguiente juego:\n";

  // Agregar juegos normales al mensaje
  items.forEach((item) => {
    // Obtener el precio y tamaño del juego
    const precio = parseFloat(item.getAttribute("Precio"));
    const tamano = parseFloat(item.getAttribute("Tamano"));

    if (!isNaN(precio) && item.classList.contains("Activacion"))
      PrecioActivaciones += precio;
    else if (!isNaN(precio)) PrecioJuegos += precio;
    if (!isNaN(tamano)) TamanoTotal += tamano;

    PrecioTotal = PrecioJuegos + PrecioActivaciones;

    // Obtener el título del juego en ambas vistas (imágenes o texto)
    let tituloJuego = obtenerTituloJuego(item);

    // Agregar el título del juego al mensaje
    if (tituloJuego) {
      mensaje += "- " + tituloJuego + "\n";
    }
  });

  // Agregar regalos al mensaje (si hay)
  if (regalos.length > 0) {
    mensaje +=
      regalos.length > 1
        ? "\n--- 🎁 REGALOS ---\n"
        : "\n--- 🎁 REGALO ---\n";

    regalos.forEach((regalo) => {
      // Obtener el tamaño del regalo
      const tamano = parseFloat(regalo.getAttribute("Tamano"));

      // Los regalos no suman al precio total, pero sí al tamaño
      if (!isNaN(tamano)) TamanoTotal += tamano;

      // Obtener el título del juego en ambas vistas (imágenes o texto)
      let tituloJuego = obtenerTituloJuego(regalo);

      // Agregar el título del juego al mensaje
      if (tituloJuego) {
        mensaje += "- " + tituloJuego + "\n";
      }
    });
  }

  // Calcular el regalo (si aplica)
  let textoRegalo = "";
  if (PrecioJuegos >= 500) {
    const cantidadDe500 = Math.floor(PrecioJuegos / 500);
    const bonoDisponible = cantidadDe500 * 150;

    // Calcular bono utilizado (suma de precios de regalos)
    let bonoUtilizado = 0;
    regalos.forEach((regalo) => {
      const precioRegalo = parseFloat(regalo.getAttribute("Precio"));
      if (!isNaN(precioRegalo)) {
        bonoUtilizado += precioRegalo;
      }
    });

    textoRegalo = ` (${bonoUtilizado} CUP de regalo aplicados de ${bonoDisponible} CUP disponibles)`;
  }

  // Agregar el precio total al mensaje
  mensaje +=
    "\nPrecio y tamaño totales: " +
    PrecioTotal +
    " CUP; " +
    TamanoTotal.toFixed(2) +
    " GB" +
    textoRegalo;

  // Preguntar residencia al cliente
  function hallarResidencia() {
    let mensajeria = confirm("¿Desea solicitar mensajería para su encargo?");
    
    if (mensajeria) {
    let residencia = prompt("¿En dónde vive?");
    return residencia;
    }
    
    else return;
    }

    let residencia = hallarResidencia();
    if (residencia) mensaje += `\n\nDeseo solicitar mensajería. Vivo en ${residencia}.`;

  // Codificar el mensaje para formato URL
  let mensajeURL = encodeURIComponent(mensaje);
  let URL = `https://wa.me/+5363975093?text=${mensajeURL}`;

  // Abrir la URL en una nueva pestaña
  window.open(URL, "_blank");
}

// Función para cambiar la vista de imágenes a texto
function cambiarVista() {
  const textoBoton = document.getElementById("botonCambiarVista");
  textoBoton.classList.toggle("BotonBolaVerde");
  const body = document.body;
  const isTraditional = body.classList.toggle("vista-tradicional");

  // Actualizar la visualización de las listas
  document.querySelectorAll("ul").forEach((ul) => {
    ul.style.display = isTraditional ? "block" : "flex";
  });

  // Procesar cada elemento de la lista
  document.querySelectorAll("li").forEach((li) => {
    if (isTraditional) {
      // Modo texto tradicional
      li.style.marginLeft = "10px";

      // Guardar contenido original si es la primera vez
      if (!li.dataset.originalContent) {
        li.dataset.originalContent = li.innerHTML;
      }

      const img = li.querySelector("img");
      if (img) {
        const nombreJuego = document.createTextNode(img.title);
        li.setAttribute("data-imgSrc", img.src);

        const enlace = li.querySelector("a");
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
      } else if (li.getAttribute("data-imgSrc")) {
        const img = document.createElement("img");
        img.src = li.getAttribute("data-imgSrc");
        img.title = li.textContent.trim();

        const enlace = li.querySelector("a");
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

  // Forzar una nueva búsqueda para actualizar los resultados
  busqueda();
}

/**
 * Reconstruye todos los botones manteniendo sus eventos
 */
function reconstruirTodosLosBotones() {
  // --- 1. Lista principal ---
  document.querySelectorAll(".listajuegos li").forEach((producto) => {
    reconstruirBotonPrincipal(producto);
    reconstruirBotonRegalo(producto);
  });

  // --- 2. RESULTADOS (solo el primer UL, NO #regalos) ---
  const resultadosLista = document.querySelector("#resultados > ul");
  resultadosLista.querySelectorAll("li").forEach((producto) => {
    reconstruirBotonResultado(producto);
    reconstruirBotonRegalo(producto);
  });

  // --- 3. DESCARTADOS ---
  document.querySelectorAll("#juegosDescartados li").forEach((producto) => {
    reconstruirBotonDescartado(producto);
    reconstruirBotonRegalo(producto);
  });

  // --- 4. REGALOS ---
  document.querySelectorAll("#regalos ul li").forEach((producto) => {
    reconstruirBotonesJuegosRegalos(producto);
  });
}

/**
 * Reconstruye botón para un producto en la lista principal
 */
function reconstruirBotonPrincipal(producto) {
  // Eliminar cualquier botón existente
  const existingAddButton = producto.querySelector(".add-button");
  const existingRemoveButton = producto.querySelector(".remove-button");
  if (existingAddButton) existingAddButton.remove();
  if (existingRemoveButton) existingRemoveButton.remove();

  // Solo crear botón de añadir si no está en resultados/descartados
  if (
    !producto.closest("#resultados") &&
    !producto.closest("#juegosDescartados")
  ) {
    const addButton = crearBoton("🛒", "add-button", "blue", function () {
      agregarProducto(producto);
    });
    producto.appendChild(addButton);
  }
}

/**
 * Reconstruye botón para un producto en resultados
 */
function reconstruirBotonResultado(producto) {
  // Eliminar cualquier botón de añadir
  const existingAddButton = producto.querySelector(".add-button");
  if (existingAddButton) existingAddButton.remove();

  // Recrear botón de eliminar
  const existingRemoveButton = producto.querySelector(".remove-button");
  if (existingRemoveButton) existingRemoveButton.remove();

  const removeButton = crearBoton("🗑️", "remove-button", "red", function () {
    devolverProducto(producto);
  });
  producto.appendChild(removeButton);
}

/**
 * Reconstruye botón para un producto en descartados
 */
function reconstruirBotonDescartado(producto) {
  // Eliminar cualquier botón de eliminar
  const existingRemoveButton = producto.querySelector(".remove-button");
  if (existingRemoveButton) existingRemoveButton.remove();

  // Recrear botón de añadir
  const existingAddButton = producto.querySelector(".add-button");
  if (existingAddButton) existingAddButton.remove();

  const addButton = crearBoton("🛒", "add-button", "blue", function () {
    agregarProducto(producto);
  });
  producto.appendChild(addButton);
}

/**
 * Reconstruye botón de regalo para un producto
 */
function reconstruirBotonRegalo(producto) {
  // Eliminar botón de regalo existente si hay
  const existingRegaloButton = producto.querySelector(".regalo-button");
  if (existingRegaloButton) existingRegaloButton.remove();

  // Solo crear botón si no está ya en regalos y no es un juego de activación
  if (!producto.classList.contains("Activacion")) {
    const regaloButton = crearBoton(
      "🎁",
      "regalo-button",
      "golden",
      function () {
        agregarComoRegalo(producto);
      },
    );
    producto.appendChild(regaloButton);
  }
}

/**
 * Reconstruye botones para regalos
 */
function reconstruirBotonesJuegosRegalos(producto) {
  // Eliminar cualquier remove-button anterior
  const botonesEliminar = producto.querySelectorAll(".remove-button");
  botonesEliminar.forEach((btn) => btn.remove());

  // Eliminar cualquier add-button anterior
  const existingAddButton = producto.querySelector(".add-button");
  if (existingAddButton) existingAddButton.remove();

  const addButton = crearBoton("🛒", "add-button", "blue", function () {
    agregarProducto(producto);
  });
  producto.appendChild(addButton);

  // Eliminar el botón de regalo si existe
  const botonRegalo = producto.querySelector(".regalo-button");
  if (botonRegalo) botonRegalo.remove();

  const removeButton = crearBoton("🗑️", "remove-button", "red", function () {
    eliminarRegalo(producto);
  });

  producto.appendChild(removeButton);
}

// Funciones para filtrar por tipo de conexión y género
function aplicarFiltrosCombinados() {
  const inputPrecio = document.getElementById("buscarPrecio");
  const inputNombre = document.getElementById("buscarNombre");
  const text = document.getElementById("texto");
  const divJuegos = document.getElementById("divJuegos");

  // Obtener valores actuales
  const maxPrice = parseFloat(inputPrecio.value);
  const filtroNombre = inputNombre.value.toLowerCase();

  // Mostrar/ocultar botones de borrar según corresponda
  document.getElementById("botonBorrarBusqueda").style.display = filtroNombre
    ? "inline-block"
    : "none";
  document.getElementById("botonBorrarPrecio").style.display = isNaN(maxPrice)
    ? "none"
    : "inline-block";

  // Obtener filtros seleccionados
  const conexionesSeleccionadas = Array.from(
    document.querySelectorAll(
      '#filtro-conexion input[name="conexion"]:checked',
    ),
  ).map((c) => c.value.trim());

  const generosSeleccionados = Array.from(
    document.querySelectorAll('#filtro-generos input[name="genero"]:checked'),
  ).map((g) => g.value.trim());

  const otrosFiltros = Array.from(
    document.querySelectorAll('#otros-filtros input[name="otros"]:checked'),
  ).map((h) => h.value.trim());

  // Modo “solo nuevos/actualizados”
  const soloNuevos = document
    .getElementById("botonJNA")
    .classList.contains("BotonBolaVerde");

  let hayResultados = false;

  // Aplicar filtros a cada juego
  document.querySelectorAll(".listajuegos li").forEach((juego) => {
    let mostrar = true;

    // --- FILTRO NUEVOS/ACTUALIZADOS ---
    if (
      soloNuevos &&
      !juego.classList.contains("juegosNuevos") &&
      !juego.classList.contains("juegosActualizados")
    ) {
      mostrar = false;
    }

    // --- FILTRO DE CONEXIÓN ---
    if (mostrar && conexionesSeleccionadas.length > 0) {
      const conexionesJuego = (juego.getAttribute("Tconex") || "")
        .split(",")
        .map((c) => c.trim());
      const cumpleConexion = conexionesSeleccionadas.some((c) =>
        conexionesJuego.includes(c),
      );
      if (!cumpleConexion) mostrar = false;
    }

    // --- FILTRO DE GÉNERO ---
    if (mostrar && generosSeleccionados.length > 0) {
      const generosJuego = (juego.getAttribute("Genero") || "")
        .split(",")
        .map((g) => g.trim());
      const cumpleGenero = generosSeleccionados.some((g) =>
        generosJuego.includes(g),
      );
      if (!cumpleGenero) mostrar = false;
    }

    // --- OTROS FILTROS ---
    if (mostrar && otrosFiltros.length > 0) {
      if (mostrar && otrosFiltros.length > 0) {
        if (mostrar && otrosFiltros.length > 0) {
          const clasesJuego = Array.from(juego.classList);

          // Convertir el filtro "Mods" → coincidir con pocosMods o muchosMods
          const coincideMods =
            otrosFiltros.includes("Mods") &&
            (clasesJuego.includes("pocosMods") ||
              clasesJuego.includes("muchosMods"));

          // Coincidencia directa con clases como "servidor" o "noProbado"
          const coincidenciaDirecta = otrosFiltros.some((f) =>
            clasesJuego.includes(f),
          );

          if (!coincideMods && !coincidenciaDirecta) {
            mostrar = false;
          }
        }
      }
    }

    // --- FILTRO DE NOMBRE ---
    if (mostrar && filtroNombre !== "") {
      const nombreJuego = obtenerTituloJuego(juego).toLowerCase();
      if (!nombreJuego.includes(filtroNombre)) mostrar = false;
    }

    // --- FILTRO DE PRECIO ---
    if (mostrar && !isNaN(maxPrice)) {
      const precioJuego = parseFloat(juego.getAttribute("Precio"));
      if (isNaN(precioJuego) || precioJuego > maxPrice) mostrar = false;
    }

    // Aplicar visibilidad final
    juego.style.display = mostrar ? "list-item" : "none";
    if (mostrar) hayResultados = true;
  });

  // Mostrar mensaje si no hay resultados
  divJuegos.style.display = hayResultados ? "block" : "none";
  text.style.display = hayResultados ? "none" : "flex";
  if (!hayResultados) {
    text.textContent =
      "No hay resultados que coincidan con los filtros aplicados.";
  }

  // Actualizar encabezados de secciones
  actualizarEncabezados();
}

function actualizarEncabezados() {
  document.querySelectorAll(".grupo-juegos").forEach((grupo) => {
    const tieneJuegosVisibles = Array.from(
      grupo.querySelectorAll(".listajuegos li"),
    ).some((li) => li.style.display !== "none");

    const encabezado = grupo.querySelector(".encabezadosjuegos");
    if (encabezado) {
      encabezado.style.display = tieneJuegosVisibles ? "block" : "none";
    }

    grupo.style.display = tieneJuegosVisibles ? "block" : "none";
  });
}

// Mostrar Información del contenedor de los Juegos por Activación
function mostrarInfoDivInfoJActiv() {
  const infoDiv = document.getElementById("divInfoJActiv");
  infoDiv.classList.toggle("contVisible");
}

// Mostrar u ocultar entradas de búsqueda
function mostrarBusqueda() {
  const divLupa = document.getElementById("divLupa");
  const divBusqueda = document.getElementById("busqueda");
  if (divBusqueda.classList.contains("visible")) {
    divBusqueda.classList.remove("visible");
    divLupa.style.display = "block";
  } else {
    divLupa.style.display = "none";
    divBusqueda.classList.add("visible");
  }
}

// Carga suave de imágenes
function cargarImagenesLazy() {
  const images = document.querySelectorAll("ul img");
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          observer.unobserve(img);
        }
      });
    },
    {
      rootMargin: "100px",
      // empieza a cargar antes de que entre al viewport
      threshold: 0.1,
    },
  );
  images.forEach((img) => observer.observe(img));
}
