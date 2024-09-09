let productos = [];
let botonesAgregar;
let botonesCategorias;
const contenedorProductos = document.querySelector("#contenedor-productos");
const tituloPrincipal = document.querySelector("#titulo-principal");
let numerito;

fetch("https://golosinas-commerce.up.railway.app/products")
    .then(response => response.json())
    .then(data => {
        productos = data;
        cargarProductos(productos);
    })
    .catch(error => console.error('Error al obtener los productos:', error));

fetch("https://golosinas-commerce.up.railway.app/categories")
    .then(response => response.json())
    .then(categories => {
        cargarCategorias(categories);
    })
    .catch(error => console.error('Error al obtener las categorías:', error));

function cargarCategorias(categorias) {
    const menu = document.querySelector('.menu');
    menu.innerHTML = `
        <li>
            <button id="todos" class="boton-menu boton-categoria active"><i class="bi bi-hand-index-thumb-fill"></i> Todos los productos</button>
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

    const carritoButton = document.createElement('li');
    carritoButton.innerHTML = `
        <a class="boton-menu boton-carrito" href="./carrito.html">
            <i class="bi bi-cart-fill"></i> Carrito <span id="numerito" class="numerito">0</span>
        </a>
    `;
    menu.appendChild(carritoButton);

    numerito = document.querySelector("#numerito");

    botonesCategorias = document.querySelectorAll(".boton-categoria");
    agregarEventListenersACategorias();

    cargarProductosEnCarrito();
}

function agregarEventListenersACategorias() {
    botonesCategorias.forEach(boton => {
        boton.addEventListener("click", (e) => {
            botonesCategorias.forEach(boton => boton.classList.remove("active"));

            e.currentTarget.classList.add("active");

            const categoriaSeleccionada = e.currentTarget.id;

            if (categoriaSeleccionada !== "todos") {
                const productosBoton = productos.filter(producto => producto.categoria.toLowerCase() === categoriaSeleccionada);
                if (productosBoton.length > 0) {
                    tituloPrincipal.innerText = productosBoton[0].categoria;
                } else {
                    tituloPrincipal.innerText = "Categoría vacía";
                }
                cargarProductos(productosBoton);
            } else {
                tituloPrincipal.innerText = "Todos los productos";
                cargarProductos(productos);
            }
        });
    });
}

function cargarProductos(productosElegidos) {
    contenedorProductos.innerHTML = "";

    productosElegidos.forEach(producto => {
        if (producto.imagen) { 
            const div = document.createElement("div");
            div.classList.add("producto");
            div.innerHTML = `
                <img class="producto-imagen" src="https://golosinas-commerce.up.railway.app/${producto.imagen}" alt="${producto.descripcion}">
                <div class="producto-detalles">
                    <h3 class="producto-titulo">${producto.descripcion}</h3>
                    <p class="producto-precio">$${producto.precio_unidad}</p>
                    <button class="producto-agregar" id="${producto.productoID}">Agregar</button>
                </div>
            `;
            contenedorProductos.append(div);
        }
    });

    actualizarBotonesAgregar();
}

function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

function cargarProductosEnCarrito() {
    let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");
    if (productosEnCarritoLS) {
        productosEnCarrito = JSON.parse(productosEnCarritoLS);
        actualizarNumerito(); // actualizar numero de productos en el carrito
    }
}

function actualizarNumerito() {
    if (numerito) {
        let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
        numerito.innerText = nuevoNumerito;
    } else {
        console.error("Elemento numerito no encontrado en el DOM.");
    }
}

function agregarAlCarrito(e) {
    Toastify({
        text: "Producto agregado",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #ff7e21, #FFAF7C)",
            borderRadius: "2rem",
            textTransform: "uppercase",
            fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem',
            y: '1.5rem'
        },
        onClick: function () { }
    }).showToast();

    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.productoID.toString() === idBoton);

    if (productosEnCarrito.some(producto => producto.productoID.toString() === idBoton)) {
        const index = productosEnCarrito.findIndex(producto => producto.productoID.toString() === idBoton);
        productosEnCarrito[index].cantidad++;
    } else {
        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
    }

    actualizarNumerito();
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

let productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];