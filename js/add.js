document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);

    // Cargar marcas y categorías
    fetch('http://localhost:3000/brands')
        .then(response => response.json())
        .then(marcas => {
            const marcaSelect = document.getElementById('marca');
            marcas.forEach(marca => {
                const option = document.createElement('option');
                option.value = marca.marcaID;
                option.textContent = marca.marca;
                marcaSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error al cargar marcas:', error));

    fetch('http://localhost:3000/categories')
        .then(response => response.json())
        .then(categorias => {
            const categoriaSelect = document.getElementById('categoria');
            categorias.forEach(categoria => {
                const option = document.createElement('option');
                option.value = categoria.categoriaID;
                option.textContent = categoria.categoria;
                categoriaSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error al cargar categorías:', error));

    // Mostrar vista previa de la imagen
    const imagenInput = document.getElementById('imagen');
    const imagenPreview = document.getElementById('imagen-preview');

    imagenInput.addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imagenPreview.src = e.target.result;
            }
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('agregar-form').addEventListener('submit', function (event) {
        event.preventDefault();

        const descripcion = document.getElementById('descripcion').value;
        const precio = document.getElementById('precio_unidad').value;
        const marcaID = document.getElementById('marca').value;
        const categoriaID = document.getElementById('categoria').value;
        const imagen = document.getElementById('imagen').files[0];

        const formData = new FormData();
        formData.append('descripcion', descripcion);
        formData.append('precio_unidad', precio);
        formData.append('marcaID', marcaID);
        formData.append('categoriaID', categoriaID);
        formData.append('imagen', imagen);

        fetch('http://localhost:3000/products', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (response.ok) {
                    return response.json(); 
                } else {
                    throw new Error('Error en la respuesta del servidor');
                }
            })
            .then(response => {
                Swal.fire({
                    title: 'Agregado',
                    text: 'El producto se agregó correctamente',
                    icon: 'success',
                    timer: 40000,
                    timerProgressBar: true
                });
            })
            .catch(error => {
                console.error('Error al agregar el producto:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un error al agregar el producto',
                    showConfirmButton: false
                });
            });
    });
});