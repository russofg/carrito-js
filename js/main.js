document.addEventListener("DOMContentLoaded", () => {
  fetchData();
});

const fetchData = async () => {
  try {
    const res = await fetch(
      "https://api.jsonbin.io/b/615ba4a29548541c29bde53c/1"
    );
    const data = await res.json();

    mostrarCharlas(data);
    detectarBotones(data);
  } catch (error) {
    console.log(error);
  }
};

const contendorcharlas = document.querySelector("#contenedor-charlas");
const mostrarCharlas = (data) => {
  const template = document.querySelector("#template-charlas").content;
  const fragment = document.createDocumentFragment();
  //creamos todas las card
  data.forEach((charla) => {
    template.querySelector("img").setAttribute("src", charla.image);
    template.querySelector("h5").textContent = charla.titulo;
    template.querySelector("h6").textContent = charla.fecha;
    template.querySelector(".card-descripcion").textContent =
      charla.descripcion;
    template.querySelector("p span").textContent = charla.precio;
    template.querySelector("button").dataset.id = charla.id;
    const clone = template.cloneNode(true);
    fragment.appendChild(clone);
  });
  contendorcharlas.appendChild(fragment);
};

let carrito = {};

const detectarBotones = (data) => {
  const botones = document.querySelectorAll(".card button");

  botones.forEach((btn) => {
    btn.addEventListener("click", () => {
      const charla = data.find((item) => item.id === parseInt(btn.dataset.id));
      charla.cantidad = 1;
      if (carrito.hasOwnProperty(charla.id)) {
        charla.cantidad = carrito[charla.id].cantidad + 1;
      }
      carrito[charla.id] = { ...charla };

      mostrarCarrito();
    });
  });
};

const items = document.querySelector("#items");

const mostrarCarrito = () => {
  items.innerHTML = "";

  const template = document.querySelector("#template-carrito").content;
  const fragment = document.createDocumentFragment();

  Object.values(carrito).forEach((charla) => {
    template.querySelector("th").textContent = charla.id;
    template.querySelectorAll("td")[0].textContent = charla.titulo;
    template.querySelectorAll("td")[1].textContent = charla.cantidad;
    template.querySelector("span").textContent =
      charla.precio * charla.cantidad;

    //botones
    template.querySelector(".btn-success").dataset.id = charla.id;
    template.querySelector(".btn-danger").dataset.id = charla.id;

    const clone = template.cloneNode(true);
    fragment.appendChild(clone);
  });

  items.appendChild(fragment);

  mostrarTotal();
  accionBotones();
};

const total = document.querySelector("#total-carrito");
const mostrarTotal = () => {
  total.innerHTML = "";

  if (Object.keys(carrito).length === 0) {
    total.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - Agrega tus Charlas!</th>
        `;
    return;
  }

  const template = document.querySelector("#template-total").content;
  const fragment = document.createDocumentFragment();

  // sumamos cantidad totales
  const nCantidad = Object.values(carrito).reduce(
    (acc, { cantidad }) => acc + cantidad,
    0
  );
  const nPrecio = Object.values(carrito).reduce(
    (acc, { cantidad, precio }) => acc + cantidad * precio,
    0
  );

  template.querySelectorAll("td")[0].textContent = nCantidad;
  template.querySelector("span").textContent = nPrecio;

  const clone = template.cloneNode(true);
  fragment.appendChild(clone);

  total.appendChild(fragment);

  const boton = document.querySelector("#vaciar-carrito");
  boton.addEventListener("click", () => {
    carrito = {};
    mostrarCarrito();
  });
};

const accionBotones = () => {
  const botonesAgregar = document.querySelectorAll("#items .btn-success");
  const botonesEliminar = document.querySelectorAll("#items .btn-danger");

  botonesAgregar.forEach((btn) => {
    btn.addEventListener("click", () => {
      const charla = carrito[btn.dataset.id];
      charla.cantidad++;
      carrito[btn.dataset.id] = { ...charla };
      mostrarCarrito();
    });
  });

  botonesEliminar.forEach((btn) => {
    btn.addEventListener("click", () => {
      const charla = carrito[btn.dataset.id];
      charla.cantidad--;
      if (charla.cantidad === 0) {
        delete carrito[btn.dataset.id];
      } else {
        carrito[btn.dataset.id] = { ...charla };
      }
      mostrarCarrito();
    });
  });
};
$(function () {
  $(".btn-dark").mouseover(function () {
    $(".btn-dark").css("color", "black");
    $(this).css("color", "grey");
  });
});
