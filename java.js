fetch ('https://api.nasa.gov/planetary/apod?zjivkN8tH9N0nAa8iPYHNrFibCOBemWMLi9bbb3J');

function formatDate(date) {
  let y = date.getFullYear();
  let m = (date.getMonth() + 1).toString().padStart(2, "0");
  let d = date.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${d}`;
}

let fechaInput = document.getElementById("fechaInput");
fechaInput.max = formatDate(new Date());

function cargarComparacion() {
  let hoy = new Date();
  let hace20 = new Date();
  hace20.setFullYear(hace20.getFullYear() - 20);

  let fechaHoyStr = formatDate(hoy);
  let fechaHace20Str = formatDate(hace20);

  let urlHoy = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${fechaHoyStr}`;
  let urlHace20 = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${fechaHace20Str}`;

  let contenedor = document.getElementById("comparacion");
  contenedor.innerHTML = "";

  fetch(urlHoy)
    .then(response => {
      if (!response.ok) {
        contenedor.innerHTML = "<p>Error al cargar la foto de hoy.</p>";
        return;
      }
      return response.json();
    })
    .then(dataHoy => {
      if (!dataHoy) return; // hubo error

      fetch(urlHace20)
        .then(response => {
          if (!response.ok) {
            contenedor.innerHTML = "<p>Error al cargar la foto de hace 20 años.</p>";
            return;
          }
          return response.json();
        })
        .then(dataHace20 => {
          if (!dataHace20) return;

          let cardHoy = document.createElement("div");
          cardHoy.className = "card";
          cardHoy.innerHTML = `
            <h3>Foto de hoy</h3>
            <img src="${dataHoy.url}" alt="${dataHoy.title}" />
            <p><strong>${dataHoy.title}</strong></p>
            <p>${dataHoy.explanation}</p>
            <p><em>Fecha: ${dataHoy.date}</em></p>
          `;

          let cardHace20 = document.createElement("div");
          cardHace20.className = "card";
          cardHace20.innerHTML = `
            <h3>Foto hace 20 años</h3>
            <img src="${dataHace20.url}" alt="${dataHace20.title}" />
            <p><strong>${dataHace20.title}</strong></p>
            <p>${dataHace20.explanation}</p>
            <p><em>Fecha: ${dataHace20.date}</em></p>
          `;

          contenedor.appendChild(cardHoy);
          contenedor.appendChild(cardHace20);
        });
    });
}

document.getElementById("fechaForm").addEventListener("submit", function(e) {
  e.preventDefault();

  let fechaUsuario = fechaInput.value;
  let resultadoDiv = document.getElementById("resultadoUsuario");
  resultadoDiv.innerHTML = "";

  if (!fechaUsuario) {
    resultadoDiv.innerHTML = "<p style='color: red;'>Por favor selecciona una fecha.</p>";
    return;
  }

  let fechaMax = new Date();
  if (new Date(fechaUsuario) > fechaMax) {
    resultadoDiv.innerHTML = "<p style='color: red;'>La fecha no puede ser futura.</p>";
    return;
  }

  let urlUser = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${fechaUsuario}`;

  fetch(urlUser)
    .then(response => {
      if (!response.ok) {
        resultadoDiv.innerHTML = "<p style='color: red;'>Error al obtener datos de la API.</p>";
        return;
      }
      return response.json();
    })
    .then(data => {
      if (!data) return;

      if (data.code === 400) {
        resultadoDiv.innerHTML = `<p style="color:red;">${data.msg}</p>`;
        return;
      }

      resultadoDiv.innerHTML = `
        <div class="card" style="max-width:600px; margin: 0 auto;">
          <h3>Foto del ${data.date}</h3>
          <img src="${data.url}" alt="${data.title}" />
          <p><strong>${data.title}</strong></p>
          <p>${data.explanation}</p>
        </div>
      `;
    });
});

cargarComparacion();