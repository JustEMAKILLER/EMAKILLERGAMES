document.addEventListener("DOMContentLoaded", function () {
  cargarImagenesLazy();
  agregarClasesEncabezados();
  agregarListenersEncabezados();
  agregarPreciosEncabezados();
});

// Agregar clases a los encabezados h4
function agregarClasesEncabezados() {
  document
    .querySelectorAll("h4")
    .forEach((h4) => h4.classList.add("Encabezados"));
}

// Agregar eventos a los encabezados h4
function agregarListenersEncabezados() {
  document.querySelectorAll("h4").forEach((h4) => {
    h4.addEventListener("click", function () {
      clickEncabezado();
    });
  });
}

// Añadir los precios de cada pack desde el atributo Precio a los encabezados
function agregarPreciosEncabezados() {
  const encabezados = document.querySelectorAll("h4");

  encabezados.forEach((encabezado) => {
    const tituloEncabezado = encabezado.querySelector("a");
    const precioPack = encabezado.getAttribute("Precio");
    tituloEncabezado.textContent =
      tituloEncabezado.textContent + " (" + precioPack + " CUP)";
  });
}

// Escuchar el evento de scroll para mostrar el botón de desplazamiento
window.addEventListener("scroll", mostrarBoton);

// Variables globales para controlar el intervalo y la posición
let animationInterval = null;
let pos = 0;
let isAnimating = false;

function mostrarBoton() {
  const scrollButton = document.getElementById("botonarriba");
  const scrollPosition =
    document.documentElement.scrollTop || document.body.scrollTop;

  // Limpiar intervalo anterior si existe
  if (animationInterval) {
    clearInterval(animationInterval);
    isAnimating = false;
  }

  // Si el scroll es mayor a 1250px, mostrar el botón con animación hacia arriba
  if (scrollPosition > 1250) {
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
  // Si el scroll es menor a 1250px, ocultar el botón con animación hacia abajo
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

function busqueda() {
  const maxPrice = parseFloat(document.getElementById("buscarprecio").value);
  const filtroNombre = document
    .getElementById("buscarnombre")
    .value.toLowerCase();
  const grupos = document.querySelectorAll(".grupo-juegos");
  const text = document.getElementById("texto");

  let hayResultados = false;

  const botonborrarbusqueda = document.getElementById("botonborrarbusqueda");
  botonborrarbusqueda.style.display = "inline-block";
  const botonborrarprecio = document.getElementById("botonborrarprecio");
  botonborrarprecio.style.display = "inline-block";

  grupos.forEach((grupo) => {
    const encabezado = grupo.querySelector("h4");
    const productos = grupo.querySelectorAll(".listajuegos li");
    let mostrarGrupo = false;

    productos.forEach((producto) => {
      const productNameFromImg = producto
        .querySelector("img")
        ?.getAttribute("title")
        .toLowerCase();
      const productNameFromLink = producto
        .querySelector("a")
        ?.textContent.trim()
        .toLowerCase();

      // Si hay un título en la imagen, usa eso, si no, usa el texto del enlace
      const productName = productNameFromImg
        ? productNameFromImg
        : productNameFromLink
          ? productNameFromLink
          : "";

      const productPrice = parseFloat(encabezado.getAttribute("Precio"));

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
  const buscarnombreInput = document.getElementById("buscarnombre");
  // Limpiar el campo de texto
  buscarnombreInput.value = "";
  busqueda();
}
// Función para borrar el campo de precio
function borrarPrecio() {
  const filtroprecioInput = document.getElementById("buscarprecio");
  // Limpiar el campo de texto
  filtroprecioInput.value = "";
  busqueda();
}
function cambiarVista() {
  const textoBoton = document.getElementById("botonCambiarVista");
  textoBoton.classList.toggle("BotonBolaVerde");
  const body = document.body;
  body.classList.toggle("vista-tradicional"); // Activa o desactiva la clase en el body

  const uls = document.querySelectorAll("ul");
  const lis = document.querySelectorAll("li");

  if (body.classList.contains("vista-tradicional")) {
    // Modo lista tradicional activado
    uls.forEach((ul) => {
      ul.style.display = "block"; // Cambia a lista vertical
    });

    lis.forEach((li) => {
      const enlace = li.querySelector("a");
      const img = li.querySelector("img");

      li.style.marginLeft += "10px";

      // Guardar el contenido original antes de modificarlo
      if (!li.dataset.originalContent) {
        li.dataset.originalContent = li.innerHTML;
      }

      if (img) {
        const nombreJuego = document.createTextNode(img.title);
        li.setAttribute("data-imgSrc", img.src); // Guarda la imagen antes de eliminarla
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
    uls.forEach((ul) => {
      ul.style.display = "flex"; // Restaura el display original
    });

    lis.forEach((li) => {
      const enlace = li.querySelector("a");
      const imgSrc = li.getAttribute("data-imgSrc");

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
}

// Si se hace click en algún encabezado en medio de la búsqueda, este lo redirigirá a su contenedor
function clickEncabezado() {
  borrarBusqueda();
  borrarPrecio();
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
