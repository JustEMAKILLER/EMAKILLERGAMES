  function busqueda() {
      const maxPrice = parseFloat(document.getElementById("buscarprecio").value);
      const filtroNombre = document.getElementById("buscarnombre").value.toLowerCase();
      const products = document.querySelectorAll('.listajuegos li')

      for (let i = 0; i < products.length; i++) {
          const productName = products[i].textContent.toLowerCase();
          const productPrice = parseFloat(products[i].getAttribute("data-price"));

          let mostrar = true;

          if (!isNaN(maxPrice) && productPrice > maxPrice) {
              mostrar = false;
          }

          if (filtroNombre !== "" && !productName.includes(filtroNombre)) {
              mostrar = false;
          }

          products[i].style.display = mostrar ? "list-item" : "none";
      }
  }