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
      const products = document.querySelectorAll('.listajuegos li')
      const headers = document.querySelectorAll('h4');
      const text = document.getElementById("texto");

      if (isNaN(maxPrice) && filtroNombre === "") {
        for (let i = 0; i < headers.length; i++){
            headers[i].style.display = "block";
        }
        for (let i = 0; i < products.length; i++){
            products[i].style.display = "list-item";
        }
        return;
    }
    let hayResultados = false;
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
          if (mostrar){
            hayResultados = true;
          }
          text.textContent= "";
          products[i].style.display = mostrar ? "list-item" : "none";
        if (headers[i]){
            headers[i].style.display = "none";}
        if (!hayResultados){
            text.textContent = "No hay resultados.";
        }
      }
  }