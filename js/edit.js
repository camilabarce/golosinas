document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId) {
        // Cargar datos del producto
        fetch(`http://localhost:3000/products/${productId}`)
            .then(response => response.json())
            .then(producto => {
                document.getElementById('descripcion').value = producto.descripcion;
                document.getElementById('precio_unidad').value = producto.precio_unidad;

                // Establecer la imagen en la vista previa
                document.getElementById('imagen-preview').src = "http://localhost:3000" + producto.imagen;

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
                        marcaSelect.value = producto.marcaID;
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
                        categoriaSelect.value = producto.categoriaID;
                    })
                    .catch(error => console.error('Error al cargar categorías:', error));
            })
            .catch(error => console.error('Error al cargar el producto:', error));
    } else {
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'No se seleccionó un producto para editar',
            showConfirmButton: false,
            timer: 3000
        });
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 2900);
    }

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

    // Actualizar el producto
    document.getElementById('editar-form').addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData();
        formData.append('descripcion', document.getElementById('descripcion').value);
        formData.append('precio_unidad', document.getElementById('precio_unidad').value);
        formData.append('marcaID', document.getElementById('marca').value);
        formData.append('categoriaID', document.getElementById('categoria').value);

        

        // Verificar si se seleccionó una nueva imagen
        if (imagenInput.files.length > 0) {
            formData.append('imagen', imagenInput.files[0]);
        } else {
            // Si no hay nueva imagen, agregar la imagen actual del producto al FormData
            const imagenActual = document.getElementById('imagen-preview').getAttribute('src');
            formData.append('imagen', imagenActual);
        }

        fetch(`http://localhost:3000/products/${productId}`, {
            method: 'PUT',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                Swal.fire({
                    title: 'Guardado',
                    text: 'Producto actualizado correctamente',
                    showConfirmButton: true,
                    icon: 'success'
                });
                setTimeout(() => {
                    window.location.href = 'admin.html';
                }, 3000);
            })
            .catch(error => {
                console.error('Error al editar el producto:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un error al editar el producto',
                    showConfirmButton: false
                });
            });
    });
});