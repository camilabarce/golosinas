let productos = [];  // Variable global para almacenar los productos

// Fetch para obtener las categorías
fetch("http://localhost:3000/categories")
  .then(response => response.json())
  .then(categories => {
    cargarCategorias(categories);
  })
  .catch(error => console.error('Error al obtener las categorías:', error));

// Fetch para obtener los productos
fetch("http://localhost:3000/products")
  .then(response => response.json())
  .then(data => {
    productos = data;  // Almacenar los productos en la variable global
    cargarProductos(productos);  // Cargar todos los productos inicialmente
  })
  .catch(error => console.error('Error al obtener los productos:', error));

// Función para cargar las categorías en el menú
function cargarCategorias(categorias) {
  const menu = document.querySelector('.menu');
  menu.innerHTML = `
    <li>
      <button id="todos" class="boton-menu boton-categoria active">
        <i class="bi bi-hand-index-thumb-fill"></i> Todos los productos
      </button>
    </li>
  `;

  categorias.forEach(categoria => {
    const li = document.createElement('li');
    li.innerHTML = `
      <button id="${categoria.categoria.toLowerCase()}" class="boton-menu boton-categoria">
        <i class="bi bi-hand-index-thumb"></i> ${categoria.categoria}
      </button>
    `;
    menu.appendChild(li);
  });

  botonesCategorias = document.querySelectorAll(".boton-categoria");
  agregarEventListenersACategorias();
}

function agregarEventListenersACategorias() {
  const tituloPrincipal = document.querySelector(".titulo-principal");

  botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {
      botonesCategorias.forEach(boton => boton.classList.remove("active"));
      e.currentTarget.classList.add("active");

      const categoriaSeleccionada = e.currentTarget.id;

      if (categoriaSeleccionada !== "todos") {
        // Filtrar productos por la categoría seleccionada
        const productosFiltrados = productos.filter(producto => producto.categoria.toLowerCase() === categoriaSeleccionada);
        const productosConImagen = productosFiltrados.filter(producto => producto.imagen);

        if (productosConImagen.length > 0) {
          // Actualizar el título principal con la categoría seleccionada
          tituloPrincipal.innerText = productosConImagen[0].categoria;
        } else {
          // Si no hay productos con imagen en la categoría
          tituloPrincipal.innerText = "Categoría vacía";
        }
        cargarProductos(productosFiltrados);
      } else {
        tituloPrincipal.innerText = "Todos los productos";
        cargarProductos(productos);
      }
    });
  });
}

// Función para cargar los productos en el contenedor
function cargarProductos(productos) {
  const contenedorCarritoVacio = document.getElementById("carrito-vacio");
  const contenedorCarritoProductos = document.getElementById("carrito-productos");

  const productosConImagen = productos.filter(producto => producto.imagen);

  if (productosConImagen.length > 0) {
    contenedorCarritoVacio.classList.add("disabled");
    contenedorCarritoProductos.classList.remove("disabled");

    contenedorCarritoProductos.innerHTML = "";

    productosConImagen.forEach(producto => {
      const div = document.createElement("div");
      div.classList.add("carrito-producto");
      div.innerHTML = `
        <img class="carrito-producto-imagen admin" src="http://localhost:3000${producto.imagen}" alt="${producto.descripcion}">
        <div class="carrito-producto-titulo">
          <small>Descripción</small>
          <h3>${producto.descripcion}</h3>
        </div>
        <div class="carrito-producto-subtotal">
          <small>Marca</small>
          <p>${producto.marca}</p>
        </div>
        <div class="carrito-producto-precio">
          <small>Precio</small>
          <p>$${producto.precio_unidad}</p>
        </div>
        <button class="carrito-producto-editar" id="${producto.productoID}" onclick="editarProducto(${producto.productoID})"><i class="bi bi-pencil-square"></i></button>
        <button class="carrito-producto-eliminar" id="${producto.productoID}" onclick="eliminarProducto(${producto.productoID})"><i class="bi bi-trash-fill"></i></button>
      `;
      contenedorCarritoProductos.append(div);
    });
  } else {
    contenedorCarritoVacio.classList.remove("disabled");
    contenedorCarritoProductos.classList.add("disabled");
  }
}

function editarProducto(id) {
  window.location.href = `editar.html?id=${id}`;
}

function agregarProducto() {
  window.location.href = "agregar.html";
}

function eliminarProducto(id) {
  Swal.fire({
    icon: "warning",
    title: "¿Está seguro?",
    text: "El producto será eliminado permanentemente",
    showDenyButton: true,
    confirmButtonText: "Sí, eliminar",
    denyButtonText: `Cancelar`,
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`http://localhost:3000/products/${id}`, {
        method: "DELETE"
      })
        .then(response => response.json())
        .then(data => {
          Swal.fire("Eliminado", "El producto ha sido eliminado", "success");
          setTimeout(() => {
            window.location.href = 'admin.html';
          }, 3000);
        })
        .catch(error => console.error("Error al eliminar el producto:", error));
    } else if (result.isDenied) {
      Swal.fire("Cancelado", "El producto no fue eliminado", "info");
    }
  });
}
