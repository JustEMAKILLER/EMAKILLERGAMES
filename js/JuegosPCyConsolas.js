// Crear los botones de adición automáticamente al cargar la página
document.addEventListener("DOMContentLoaded", function () {
  cargarImagenesLazy();
  crearBotonesAdicion();
  agregarTextoNuevoOActualizado();
  agregarIconosFiltrosAJuegos();
  agregarPreciosAJuegos();
  agregarTamanosAJuegos();
  agregarListenersFiltros();
  agregarListenersImgBotonesMenu();
});

/**
 * Crea los botones de adición (🛒) y regalo (🎁) para todos los juegos
 * de la lista principal que no estén en resultados, descartados o regalos.
 */
function crearBotonesAdicion() {
  document
    .querySelectorAll(
      ".listajuegos li:not(#resultados li):not(#juegosDescartados li):not(#regalos li)"
    )
    .forEach((producto) => {
      reconstruirFooter(producto);
    });
}

/**
 * Añade el texto "(Nuevo)" o "(Actualizado)" después del nombre del juego
 * para los elementos que tengan las clases 'juegosNuevos' o 'juegosActualizados'.
 */
function agregarTextoNuevoOActualizado() {
  // Seleccionar los elementos li con las clases relevantes
  const elementosLi = document.querySelectorAll(
    "li.juegosNuevos, li.juegosActualizados"
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

/**
 * Añade iconos visuales (conexión, género, mods, servidor, etc.) a cada juego
 * basándose en los atributos 'Tconex', 'Genero' y las clases CSS del elemento.
 */
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
    if (
      clases.includes("servidor") ||
      obtenerTituloJuego(li).includes("Servidor")
    ) {
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
        icono.src = "img/filtros/Activacion.webp";
        icono.alt = "Activación requerida";
        icono.title = "Activación requerida";
        iconosContainer.appendChild(icono);
      }

      // Añadir iconos de Hypervisor si el juego lo requiere
      if (li.classList.contains("Hypervisor")) {
        const icono = document.createElement("img");
        icono.className = "li-icono-filtro";
        icono.src = "img/filtros/Hypervisor.webp";
        icono.alt = "Hypervisor";
        icono.title = "Hypervisor";
        iconosContainer.appendChild(icono);
      }

      // Añadir contenedor de iconos al li
      li.appendChild(iconosContainer);
    }
  });
}

/**
 * Configura los event listeners para los filtros de conexión, género y otros filtros.
 * Al cambiar un checkbox, se limpia el dataset y se re-aplican los filtros combinados.
 */
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

/**
 * Agrega event listeners a las imágenes del menú desplegable de juegos
 * para desmarcar todos los checkboxes de filtros al hacer clic.
 */
function agregarListenersImgBotonesMenu() {
  document.querySelectorAll("#menuDesplegado a img").forEach((img) => {
    img.addEventListener("click", desmarcarCheckboxes);
  });
}

/**
 * Calcula y asigna el precio a cada juego según sus clases CSS (tamaño, mods, servidor, etc.)
 * y agrega el precio en el DOM y en el atributo 'title' de la imagen.
 */
function agregarPreciosAJuegos() {
  const juegos = document.querySelectorAll("li");
  juegos.forEach((juego) => {
    let precio = 0;
    if (juego.getAttribute("Precio")) {
      precio = juego.getAttribute("Precio");
    } else {
      if (juego.classList.contains("precio1")) precio += 50; // 0 GB Y <= 5 GB
      if (juego.classList.contains("precio2")) precio += 100; // + 5 GB Y <= 10 GB
      if (juego.classList.contains("precio3")) precio += 200; // + 10 GB Y <= 20 GB
      if (juego.classList.contains("precio4")) precio += 300; // + 20 GB Y <= 40 GB
      if (juego.classList.contains("precio5")) precio += 400; // + 40 GB Y <= 60 GB
      if (juego.classList.contains("precio6")) precio += 500; // + 60 GB
      if (juego.classList.contains("crack")) precio += 100; // Crack LAN u Online
      if (juego.classList.contains("pocosMods")) precio += 50;
      if (juego.classList.contains("muchosMods")) precio += 100;
      if (juego.classList.contains("servidor")) precio += 200; // Servidor Dedicado adicionado
      if (juego.classList.contains("Activacion")) precio += 1500;
      if (juego.classList.contains("consolas")) precio += 100;
      if (juego.classList.contains("Nswitch")) precio += 200;
    }
    agregarPrecioANombresJuegos(juego, precio);
    juego.setAttribute("Precio", precio);
  });
}

/**
 * Muestra el precio de un juego en el DOM (como span) y lo añade al atributo 'title'
 * de la imagen para la vista tradicional.
 * @param {HTMLElement} juego - Elemento li del juego.
 * @param {number} precio - Precio calculado.
 */
function agregarPrecioANombresJuegos(juego, precio) {
  /*   Vista por imágenes */
  // Eliminar contenedor de precio existente si hay
  const precioContainerExistente = juego.querySelector(".li-precio");
  if (precioContainerExistente) {
    precioContainerExistente.remove();
  }
  const precioContainer = document.createElement("div");
  precioContainer.className = "li-precio";
  const textoPrecio = document.createElement("span");
  textoPrecio.textContent = `${precio} CUP`;
  textoPrecio.style.color = "lightgreen";
  textoPrecio.style.fontSize = "0.9em";
  precioContainer.appendChild(textoPrecio);
  juego.appendChild(precioContainer);

  /* Vista tradicional */
  let nombre = obtenerTituloJuego(juego);
  nombre += "- " + precio + " CUP";
  img = juego.querySelector("img");
  img.setAttribute("title", nombre);
}

/**
 * Muestra el tamaño de un juego en el DOM (como span)
 */
function agregarTamanosAJuegos() {
  const juegos = document.querySelectorAll("li");
  juegos.forEach((juego) => {
    let tamano = juego.getAttribute("Tamano");

    /*   Vista por imágenes */
    // Eliminar contenedor de tamaño existente si hay
    const tamanoContainerExistente = juego.querySelector(".li-tamano");
    if (tamanoContainerExistente) {
      tamanoContainerExistente.remove();
    }
    const tamanoContainer = document.createElement("div");
    tamanoContainer.className = "li-tamano";
    const textoTamano = document.createElement("span");
    textoTamano.textContent = `${tamano} GB`;
    textoTamano.style.color = "lightblue";
    textoTamano.style.fontSize = "0.9em";
    tamanoContainer.appendChild(textoTamano);
    juego.appendChild(tamanoContainer);
  });
}

// Escuchar el evento de scroll para mostrar el botón de desplazamiento
window.addEventListener("scroll", mostrarBoton);

/**
 * Muestra u oculta el botón de "volver arriba" según la posición del scroll,
 * con una animación suave de entrada/salida.
 */
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

/**
 * Desmarca todos los checkboxes de los filtros (conexión, género y otros)
 * y re-aplica los filtros combinados. También limpia búsqueda y precio si el menú está abierto.
 */
function desmarcarCheckboxes() {
  if (
    document.getElementById("botonJNA").classList.contains("BotonBolaVerde")
  ) {
    mostrarJuegosDesdeMenuJuegos();
  }

  const checkboxes = document.querySelectorAll(
    '#filtro-conexion input[name="conexion"]'
  );
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });

  const checkboxesgenero = document.querySelectorAll(
    '#filtro-generos input[name="genero"]'
  );
  checkboxesgenero.forEach((checkbox) => {
    checkbox.checked = false;
  });

  const otroscheckboxes = document.querySelectorAll(
    '#otros-filtros input[name="otros"]'
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

/**
 * Verifica si hay elementos en la lista de descartados y muestra/oculta el contenedor.
 */
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

/**
 * Agrega un producto al div de resultados (carrito).
 * @param {HTMLElement} producto - Elemento li del juego a agregar.
 */
function agregarProducto(producto) {
  const resultadosDiv = document.getElementById("resultados");
  const listaResultados = resultadosDiv.querySelector("ul:first-of-type");

  // Descontar monto de filtro de precio si existe según precio de producto
  const inputPrecio = document.getElementById("buscarPrecio");
  const precioFiltro = parseFloat(inputPrecio.value);
  const precioProducto = producto.getAttribute("Precio");

  if (precioFiltro) {
    inputPrecio.classList.add("amarillo");
    inputPrecio.value -= precioProducto;
  }

  if (inputPrecio.value <= 0) {
    inputPrecio.classList.add("rojo");
  }

  listaResultados.appendChild(producto);
  reconstruirFooter(producto);
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
 * Agrega un juego como regalo con validación de precio mínimo (500 CUP)
 * y bono disponible (150 CUP por cada 500 CUP en juegos seleccionados).
 * @param {HTMLElement} producto - Elemento li del juego a agregar como regalo.
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
    if (
      !isNaN(precio) &&
      !item.classList.contains("Activacion") &&
      item !== producto
    ) {
      PrecioJuegos += precio;
    }
  });

  // Validar si cumple con el requisito de 500 CUP
  if (PrecioJuegos < 500) {
    alert(
      `Para poder agregar regalos necesita al menos un total de 500 CUP en los juegos que seleccione.\nActualmente tiene un total de: ${PrecioJuegos} CUP en dichos juegos`
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
    if (!isNaN(precioRegalo) && regalo !== producto) {
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
        `Seleccione un juego de menor precio o elimine algunos regalos actuales.`
    );
    return;
  }

  // Si cumple todos los requisitos, agregar como regalo
  agregarRegalo(producto);
}

/**
 * Agrega un producto al div de regalos.
 * @param {HTMLElement} producto - Elemento li del juego a agregar como regalo.
 */
function agregarRegalo(producto) {
  const regalosDiv = document.getElementById("regalos");
  const listaRegalos = regalosDiv.querySelector("ul");
  const calculoPrecio = document.getElementById("calculoPrecio");

  listaRegalos.style.display = "flex";
  calculoPrecio.style.display = "block";
  regalosDiv.style.display = "block";

  listaRegalos.appendChild(producto);
  reconstruirFooter(producto);
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

/**
 * Devuelve un producto de resultados a la lista de descartados.
 * @param {HTMLElement} producto - Elemento li del juego a devolver.
 */
function devolverProducto(producto) {
  const juegosDescartadosDiv = document.getElementById("juegosDescartados");
  const listaDescartados = juegosDescartadosDiv.querySelector("ul");

  listaDescartados.appendChild(producto);
  reconstruirFooter(producto);
  ordenarListaAlfabeticamente(listaDescartados);
  hayDescartados();
  actualizarPrecioYTamano();
}

/**
 * Elimina un regalo y lo mueve a la lista de descartados.
 * @param {HTMLElement} producto - Elemento li del regalo a eliminar.
 */
function eliminarRegalo(producto) {
  const juegosDescartadosDiv = document.getElementById("juegosDescartados");
  const listaDescartados = juegosDescartadosDiv.querySelector("ul");

  listaDescartados.appendChild(producto);
  reconstruirFooter(producto);
  ordenarListaAlfabeticamente(listaDescartados);
  hayDescartados();
  actualizarPrecioYTamano();

  // Verificar si quedan regalos después de eliminar este
  verificarVisibilidadRegalos();
}

/**
 * Mueve todos los elementos de la lista de descartados a resultados.
 */
function agregarTodo() {
  const juegosDescartadosDiv = document.getElementById("juegosDescartados");
  const items = Array.from(juegosDescartadosDiv.querySelectorAll("li"));

  items.forEach((item) => {
    agregarProducto(item); // Reutilizar la función para asegurar la lógica consistente
  });
  juegosDescartadosDiv.style.display = "none";
  actualizarPrecioYTamano();
}

/**
 * Borra todos los elementos de la lista de resultados y los mueve a descartados.
 */
function eliminarTodo() {
  const resultadosDiv = document.getElementById("resultados");
  const items = Array.from(resultadosDiv.querySelectorAll("li"));

  items.forEach((item) => {
    devolverProducto(item);
  });
  hayDescartados();
  actualizarPrecioYTamano();
}

/**
 * Elimina todos los regalos y los envía a la lista de descartados.
 */
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

/**
 * Verifica si hay regalos y oculta/muestra el contenedor de regalos y el cálculo de precio.
 */
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

/**
 * Actualiza el precio total, el tamaño total, la cantidad de juegos y regalos,
 * y el cálculo del bono de regalo disponible. También maneja la visibilidad de los contenedores.
 */
function actualizarPrecioYTamano() {
  const resultadosDiv = document.getElementById("resultados");
  const carritoHeader = document.getElementById("encabezadoResultados");
  const regalosDiv = document.getElementById("regalos");
  const regalosHeader = document.getElementById("encabezadoRegalos");
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

  // Actualizar cantidad de juegos seleccionados en el carrito
  carritoHeader.textContent =
    "🛒Carrito de juegos seleccionados " + "(" + items.length + ")";

  // Actualizar cantidad de regalos seleccionados
  regalosHeader.textContent = "🎁Regalos✨ " + "(" + regalos.length + ")";

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
      Math.round(TamanoTotal) +
      " GB" +
      textoRegalo;
  } else {
    calculoPrecio.textContent =
      "Precio y tamaño totales: " +
      PrecioTotal +
      " CUP; " +
      Math.round(TamanoTotal) +
      " GB";
  }

  // Eliminar todos los regalos que estén seleccionados si se quitan juegos del carrito
  if (regalos.length <= 0) eliminarRegalos();

  resultadosDiv.style.display = items.length > 0 ? "block" : "none";
  calculoPrecio.style.display = items.length > 0 ? "block" : "none";

  // Verificar visibilidad de regalos
  verificarVisibilidadRegalos();
}

/**
 * Ordena alfabéticamente (por título) los elementos de una lista.
 * @param {HTMLElement} lista - Elemento ul que contiene los li a ordenar.
 */
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

/**
 * Obtiene el título del juego de manera consistente, funcionando tanto en modo tradicional como en modo imágenes.
 * @param {HTMLElement} item - Elemento li del juego.
 * @returns {string} Título del juego.
 */
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

/**
 * Crea un botón con propiedades personalizadas.
 * @param {string} text - Texto del botón.
 * @param {string} className - Clase CSS del botón.
 * @param {string} color - Color del texto.
 * @param {Function} onClick - Función a ejecutar al hacer clic.
 * @param {string} title - Texto que se muestra en el tooltip al pasar el mouse.
 * @returns {HTMLButtonElement} Botón creado.
 */
function crearBoton(text, className, color, onClick, title) {
  const button = document.createElement("button");
  button.textContent = text;
  button.className = className;
  button.style.cursor = "pointer";
  button.style.color = color;
  button.title = title;
  button.ariaLabel = title;
  button.onclick = onClick;
  return button;
}

/**
 * Crea el footer (pie de foto) para un producto y lo agrega al li.
 * @param {HTMLElement} producto - Elemento li del juego.
 * @param {string} tipo - 'principal', 'resultado', 'descartado', 'regalo'.
 */
function crearFooter(producto, tipo) {
    // Eliminar footer existente si hay
    const footerExistente = producto.querySelector(".li-footer");
    if (footerExistente) footerExistente.remove();

    // Eliminar botones sueltos que puedan quedar
    producto
        .querySelectorAll(
            ".add-button, .remove-button, .regalo-button, .info-button"
        )
        .forEach((b) => b.remove());

    const footer = document.createElement("div");
    footer.className = "li-footer";

    // --- 1. Botón Añadir (🛒) o Eliminar (🗑️) ---
    if (tipo === "principal" || tipo === "descartado") {
        const addButton = crearBoton(
            "🛒",
            "add-button",
            "#00bfff",
            function (e) {
                e.stopPropagation();
                agregarProducto(producto);
            },
            "Añadir al carrito"
        );
        footer.appendChild(addButton);
    }

    if (tipo === "resultado" || tipo === "regalo") {
        const removeButton = crearBoton(
            "🗑️",
            "remove-button",
            "#ff4444",
            function (e) {
                e.stopPropagation();
                if (tipo === "resultado") {
                    devolverProducto(producto);
                } else {
                    eliminarRegalo(producto);
                }
            },
            "Eliminar"
        );
        footer.appendChild(removeButton);
    }

    // --- 2. Botón Información (ℹ️) ---
    const enlace = producto.querySelector("a");
    if (enlace && enlace.href && !enlace.classList.contains("juegosSinEnlace")) {
        const infoButton = crearBoton(
            "ℹ️",
            "info-button",
            "#ffffff",
            function (e) {
                e.stopPropagation();
                window.open(enlace.href, "_blank");
            },
            "Explorar información adicional del juego"
        );
        footer.appendChild(infoButton);
    }

    // --- 3. Botón Regalo (🎁) ---
    if (tipo === "principal" || tipo === "resultado" || tipo === "descartado") {
        if (!producto.classList.contains("Activacion")) {
            const regaloButton = crearBoton(
                "🎁",
                "regalo-button",
                "#ffd700",
                function (e) {
                    e.stopPropagation();
                    agregarComoRegalo(producto);
                },
                "Añadir como regalo"
            );
            footer.appendChild(regaloButton);
        }
    }

    producto.appendChild(footer);
}

/**
 * Reconstruye el footer para un producto según su ubicación.
 * @param {HTMLElement} producto - Elemento li del juego.
 */
function reconstruirFooter(producto) {
  // Determinar el tipo según dónde esté el producto
  let tipo = "principal";
  if (producto.closest("#resultados") && !producto.closest("#regalos")) {
    tipo = "resultado";
  } else if (producto.closest("#juegosDescartados")) {
    tipo = "descartado";
  } else if (producto.closest("#regalos")) {
    tipo = "regalo";
  }
  crearFooter(producto, tipo);
}

/**
 * Realiza la búsqueda y filtrado de juegos combinando:
 * - Búsqueda por nombre
 * - Filtro de precio
 * - Filtros de conexión, género y otros
 * - Modo "solo nuevos/actualizados"
 * Actualiza la visibilidad de los juegos y muestra mensaje si no hay resultados.
 */
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
    document.querySelectorAll('#filtro-conexion input[name="conexion"]:checked')
  ).map((c) => c.value.trim());

  const generosSeleccionados = Array.from(
    document.querySelectorAll('#filtro-generos input[name="genero"]:checked')
  ).map((g) => g.value.trim());

  const otrosFiltros = Array.from(
    document.querySelectorAll('#otros-filtros input[name="otros"]:checked')
  ).map((h) => h.value.trim());

  const soloNuevos = document
    .getElementById("botonJNA")
    .classList.contains("BotonBolaVerde");

  let hayResultados = false;

  grupos.forEach((grupo) => {
    const productos = grupo.querySelectorAll(".listajuegos li");
    let mostrarGrupo = false;

    productos.forEach((producto) => {
      let nombreCompleto = obtenerTituloJuego(producto);
      const indicePrecio = nombreCompleto.indexOf("(");
      let productName = nombreCompleto;
      if (indicePrecio !== -1) {
        productName = nombreCompleto.substring(0, indicePrecio).trim();
      }
      productName = productName.toLowerCase();
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
          conexionesJuego.includes(c)
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

        // Si el juego tiene Servidor o no está probado
        const coincidenciaDirecta = otrosFiltros.some(
          (f) => clasesJuego.includes(f) || productName.includes("servidor")
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

/**
 * Borra el campo de búsqueda por nombre y ejecuta la búsqueda nuevamente.
 */
function borrarBusqueda() {
  const buscarNombreInput = document.getElementById("buscarNombre");
  // Limpiar el campo de texto
  buscarNombreInput.value = "";
  buscarNombreInput.focus();
  busqueda();
}

/**
 * Borra el campo de filtro de precio y re-ejecuta la búsqueda o los filtros combinados.
 */
function borrarPrecio() {
  const filtroPrecioInput = document.getElementById("buscarPrecio");
  filtroPrecioInput.value = "";
  filtroPrecioInput.focus();

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

/**
 * Muestra solo los juegos con las clases 'juegosNuevos' o 'juegosActualizados',
 * ocultando el resto y activando el modo correspondiente.
 */
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
    (encabezado) => (encabezado.style.display = "none")
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

/**
 * Muestra todos los juegos, desactivando el modo "solo nuevos/actualizados"
 * y restaurando la visibilidad completa.
 */
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

/**
 * Muestra todos los juegos desde el menú de juegos, desactivando el modo "solo nuevos/actualizados".
 */
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

/**
 * Muestra el menú desplegable y configura los eventos para cerrarlo.
 */
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

/**
 * Cierra el menú desplegable y restaura el botón de apertura.
 */
function cerrarMenu() {
  const menuDesplegado = document.getElementById("menuDesplegado");
  const botonMenuDesplegable = document.getElementById("botonMenuDesplegable");
  botonMenuDesplegable.removeEventListener("click", cerrarMenu);
  botonMenuDesplegable.addEventListener("click", mostrarMenu);
  botonMenuDesplegable.style.borderRadius = "50px";
  menuDesplegado.style.display = "none";
}

/**
 * Envía el listado de juegos seleccionados (incluyendo regalos) por WhatsApp.
 * Genera un mensaje con el detalle de juegos, precios, tamaños y opción de mensajería.
 */
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
      regalos.length > 1 ? "\n--- REGALOS ---\n" : "\n--- REGALO ---\n";

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

  // Completar mensaje con la información hasta el momento
  mensaje +=
    "\nPrecio y tamaño totales: " +
    PrecioTotal +
    " CUP; " +
    Math.round(TamanoTotal) +
    " GB" +
    textoRegalo;

  // Preguntar residencia al cliente para solicitar mensajería solo si el precio total de su encargo llega a 1000 CUP o más
  if (PrecioTotal >= 1000) {
    function hallarResidencia() {
      let mensajeria = confirm("¿Desea solicitar mensajería para su encargo?");

      if (mensajeria) {
        let residencia = prompt("¿En dónde vive? (Ingrese dirección exacta)");
        return residencia;
      } else return;
    }

    let residencia = hallarResidencia();
    if (residencia) {
      residencia = residencia.trim();

      // Agregar al mensaje la información de la residencia si solicita mensajería
      mensaje += `\n\nDeseo solicitar mensajería. Vivo en ${residencia}.`;
    }
  }

  // Codificar el mensaje para formato URL
  let mensajeURL = encodeURIComponent(mensaje);
  let URL = `https://wa.me/+5363975093?text=${mensajeURL}`;

  // Abrir la URL en una nueva pestaña
  window.open(URL, "_blank");
}

/**
 * Cambia entre la vista de imágenes y la vista tradicional (texto).
 */
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
      li.style.paddingBottom = "0";

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
          // Si no hay enlace, insertar solo el nombre
          const existingText = li.textContent.trim();
          if (!existingText || existingText === "") {
            li.innerHTML = "";
            li.appendChild(nombreJuego);
          }
        }
      }
    } else {
      // Modo imágenes
      li.style.marginLeft = "0";
      li.style.paddingBottom = "45px";

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
    // Reconstruir el footer para este li después de cambiar la vista
    reconstruirFooter(li);
  });

  // Forzar una nueva búsqueda para actualizar los resultados
  busqueda();
}

/**
 * Aplica todos los filtros combinados (conexión, género, otros, precio, nombre, nuevos/actualizados)
 * y actualiza la visibilidad de los juegos en la interfaz.
 */
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
    document.querySelectorAll('#filtro-conexion input[name="conexion"]:checked')
  ).map((c) => c.value.trim());

  const generosSeleccionados = Array.from(
    document.querySelectorAll('#filtro-generos input[name="genero"]:checked')
  ).map((g) => g.value.trim());

  const otrosFiltros = Array.from(
    document.querySelectorAll('#otros-filtros input[name="otros"]:checked')
  ).map((h) => h.value.trim());

  // Modo "solo nuevos/actualizados"
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
        conexionesJuego.includes(c)
      );
      if (!cumpleConexion) mostrar = false;
    }

    // --- FILTRO DE GÉNERO ---
    if (mostrar && generosSeleccionados.length > 0) {
      const generosJuego = (juego.getAttribute("Genero") || "")
        .split(",")
        .map((g) => g.trim());
      const cumpleGenero = generosSeleccionados.some((g) =>
        generosJuego.includes(g)
      );
      if (!cumpleGenero) mostrar = false;
    }

    // --- OTROS FILTROS  ---
    if (mostrar && otrosFiltros.length > 0) {
      const clasesJuego = Array.from(juego.classList);

      // Verificar si coincide con "Mods" (pocosMods o muchosMods)
      const coincideMods = otrosFiltros.some(
        (f) =>
          f === "Mods" &&
          (clasesJuego.includes("pocosMods") ||
            clasesJuego.includes("muchosMods"))
      );

      // Verificar si coincide con otros filtros directos
      const coincideDirecto = otrosFiltros.some(
        (f) =>
          clasesJuego.includes(f) ||
          (f === "servidor" &&
            obtenerTituloJuego(juego).toLowerCase().includes("servidor"))
      );

      if (!coincideMods && !coincideDirecto) {
        mostrar = false;
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

/**
 * Actualiza la visibilidad de los encabezados de cada grupo de juegos
 * según si tienen al menos un juego visible.
 */
function actualizarEncabezados() {
  document.querySelectorAll(".grupo-juegos").forEach((grupo) => {
    const tieneJuegosVisibles = Array.from(
      grupo.querySelectorAll(".listajuegos li")
    ).some((li) => li.style.display !== "none");

    const encabezado = grupo.querySelector(".encabezadosjuegos");
    if (encabezado) {
      encabezado.style.display = tieneJuegosVisibles ? "block" : "none";
    }

    grupo.style.display = tieneJuegosVisibles ? "block" : "none";
  });
}

/**
 * Muestra u oculta el contenedor de información de juegos por Activación/Hypervisor.
 */
function mostrarInfoDivInfoJActivHyp() {
  const infoDiv = document.getElementById("divInfoJActivHyp");
  infoDiv.classList.toggle("contVisible");
}

/**
 * Muestra u oculta el campo de búsqueda y el botón de lupa asociado.
 */
function mostrarBusqueda() {
  const divLupa = document.getElementById("divLupa");
  const divBusqueda = document.getElementById("busqueda");
  const buscarNombreInput = document.getElementById("buscarNombre");
  if (divBusqueda.classList.contains("visible")) {
    divBusqueda.classList.remove("visible");
    divLupa.style.display = "block";
  } else {
    divLupa.style.display = "none";
    divBusqueda.classList.add("visible");
    buscarNombreInput.focus();
  }
}

/**
 * Implementa carga diferida (lazy loading) para las imágenes usando IntersectionObserver.
 */
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
    }
  );
  images.forEach((img) => observer.observe(img));
}

/**
 * Ordena los juegos por precio de menor a mayor (ascendente).
 */
function ordenarPorPrecioAsc() {
  const grupos = document.querySelectorAll(".grupo-juegos");
  grupos.forEach((grupo) => {
    const listaJuegos = grupo.querySelector("ul:first-of-type");
    if (!listaJuegos) return;

    const items = Array.from(listaJuegos.querySelectorAll("li"));

    items.sort((a, b) => {
      const precioA = parseFloat(a.getAttribute("Precio")) || 0;
      const precioB = parseFloat(b.getAttribute("Precio")) || 0;
      return precioA - precioB;
    });

    // Vaciar y volver a llenar la lista ordenada
    listaJuegos.innerHTML = "";
    items.forEach((item) => listaJuegos.appendChild(item));
  });
}

/**
 * Ordena los juegos por precio de mayor a menor (descendente).
 */
function ordenarPorPrecioDesc() {
  const grupos = document.querySelectorAll(".grupo-juegos");
  grupos.forEach((grupo) => {
    const listaJuegos = grupo.querySelector("ul:first-of-type");
    if (!listaJuegos) return;

    const items = Array.from(listaJuegos.querySelectorAll("li"));

    items.sort((a, b) => {
      const precioA = parseFloat(a.getAttribute("Precio")) || 0;
      const precioB = parseFloat(b.getAttribute("Precio")) || 0;
      return precioB - precioA;
    });

    // Vaciar y volver a llenar la lista ordenada
    listaJuegos.innerHTML = "";
    items.forEach((item) => listaJuegos.appendChild(item));
  });
}

/**
 * Ordena los juegos por nombre de A a Z (ascendente).
 */
function ordenarPorNombreA_Z() {
  const grupos = document.querySelectorAll(".grupo-juegos");
  grupos.forEach((grupo) => {
    const listaJuegos = grupo.querySelector("ul:first-of-type");
    if (!listaJuegos) return;

    const items = Array.from(listaJuegos.querySelectorAll("li"));

    items.sort((a, b) => {
      const nombreA = obtenerTituloJuego(a).toLowerCase();
      const nombreB = obtenerTituloJuego(b).toLowerCase();
      return nombreA.localeCompare(nombreB);
    });

    // Vaciar y volver a llenar la lista ordenada
    listaJuegos.innerHTML = "";
    items.forEach((item) => listaJuegos.appendChild(item));
  });
}

/**
 * Ordena los juegos por nombre de Z a A (descendente).
 */
function ordenarPorNombreZ_A() {
  const grupos = document.querySelectorAll(".grupo-juegos");
  grupos.forEach((grupo) => {
    const listaJuegos = grupo.querySelector("ul:first-of-type");
    if (!listaJuegos) return;

    const items = Array.from(listaJuegos.querySelectorAll("li"));

    items.sort((a, b) => {
      const nombreA = obtenerTituloJuego(a).toLowerCase();
      const nombreB = obtenerTituloJuego(b).toLowerCase();
      return nombreB.localeCompare(nombreA);
    });

    // Vaciar y volver a llenar la lista ordenada
    listaJuegos.innerHTML = "";
    items.forEach((item) => listaJuegos.appendChild(item));
  });
}

/**
 * Ordena los juegos por tamaño de menor a mayor (ascendente).
 */
function ordenarPorTamanoAsc() {
  const grupos = document.querySelectorAll(".grupo-juegos");
  grupos.forEach((grupo) => {
    const listaJuegos = grupo.querySelector("ul:first-of-type");
    if (!listaJuegos) return;

    const items = Array.from(listaJuegos.querySelectorAll("li"));

    items.sort((a, b) => {
      const tamanoA = parseFloat(a.getAttribute("Tamano")) || 0;
      const tamanoB = parseFloat(b.getAttribute("Tamano")) || 0;
      return tamanoA - tamanoB;
    });

    // Vaciar y volver a llenar la lista ordenada
    listaJuegos.innerHTML = "";
    items.forEach((item) => listaJuegos.appendChild(item));
  });
}

/**
 * Ordena los juegos por tamaño de mayor a menor (descendente).
 */
function ordenarPorTamanoDesc() {
  const grupos = document.querySelectorAll(".grupo-juegos");
  grupos.forEach((grupo) => {
    const listaJuegos = grupo.querySelector("ul:first-of-type");
    if (!listaJuegos) return;

    const items = Array.from(listaJuegos.querySelectorAll("li"));

    items.sort((a, b) => {
      const tamanoA = parseFloat(a.getAttribute("Tamano")) || 0;
      const tamanoB = parseFloat(b.getAttribute("Tamano")) || 0;
      return tamanoB - tamanoA;
    });

    // Vaciar y volver a llenar la lista ordenada
    listaJuegos.innerHTML = "";
    items.forEach((item) => listaJuegos.appendChild(item));
  });
}

// Event listener para detectar cambios en el selector de filtro de orden
document.getElementById("filtro-orden").addEventListener("change", function () {
  const filter = document.getElementById("filtro-orden").value;
  if (filter === "NombreDesc") {
    ordenarPorNombreZ_A();
  } else if (filter === "NombreAsc") {
    ordenarPorNombreA_Z();
  } else if (filter === "TamanoAsc") {
    ordenarPorTamanoAsc();
  } else if (filter === "TamanoDesc") {
    ordenarPorTamanoDesc();
  } else if (filter === "PrecioAsc") {
    ordenarPorPrecioAsc();
  } else if (filter === "PrecioDesc") {
    ordenarPorPrecioDesc();
  }
  return;
});
