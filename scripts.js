 document.addEventListener('DOMContentLoaded', function(){
 document.getElementById('buscar').addEventListener('input', function() {
            let filtro = this.value.toLowerCase();
            let elementos = document.querySelectorAll('.listajuegos li');
            elementos.forEach(function(elemento) {
                if (elemento.textContent.toLowerCase().includes(filtro)) {
                    elemento.classList.remove('oculto');
                } else {
                    elemento.classList.add('oculto');
                }
            });
        });
    });