let apiKey = "zjivkN8tH9N0nAa8iPYHNrFibCOBemWMLi9bbb3J";


function getApod(url, callback) {
  fetch(url)
    .then(function(res) { return res.json(); })
    .then(function(data) { callback(data); })
    .catch(function(error) {
      console.log("Error:", error);
      callback({ error: "No se pudo obtener la información." });
    });
}

function renderApod(containerId, lista) {
  let container = document.getElementById(containerId);
  container.innerHTML = "";

  for (let i = 0; i < lista.length; i++) {
    let item = lista[i];

    if (item.error) {
      container.innerHTML += "<p style='color:red;'>" + item.error + "</p>";
      continue;
    }

    let media = "";
    if (item.media_type === "image") {
      media = "<img src='" + item.url + "' alt='" + item.title + "'>";
    } else {
      media = "<iframe src='" + item.url + "' frameborder='0'></iframe>";
    }

    container.innerHTML +=
      "<div class='apod-card'>" +
        "<h3>" + (item.title || "Sin título") + "</h3>" +
        media +
        "<p><strong>Fecha:</strong> " + item.date + "</p>" +
        "<p>" + (item.explanation || "Sin descripción") + "</p>" +
      "</div>";
  }
}


function mostrarComparacionInicial() {
  let hoy = new Date();
  let dia = String(hoy.getDate()).padStart(2, '0');
  let mes = String(hoy.getMonth() + 1).padStart(2, '0');
  let anio = hoy.getFullYear();

  let fechaActual = anio + "-" + mes + "-" + dia;
  let fechaPasada = (anio - 20) + "-" + mes + "-" + dia;

  getApod("https://api.nasa.gov/planetary/apod?api_key=" + apiKey + "&date=" + fechaActual, function(actual) {
    getApod("https://api.nasa.gov/planetary/apod?api_key=" + apiKey + "&date=" + fechaPasada, function(pasada) {
      renderApod("autoComparacion", [
        { title: "Hace 20 años (" + fechaPasada + ")", date: pasada.date, url: pasada.url, media_type: pasada.media_type, explanation: pasada.explanation },
        { title: "Hoy (" + fechaActual + ")", date: actual.date, url: actual.url, media_type: actual.media_type, explanation: actual.explanation }
      ]);
    });
  });
}


function compararConFecha() {
  let fecha = document.getElementById("fechaUsuario").value;
  if (!fecha) {
    alert("Por favor elige una fecha.");
    return;
  }

  let fechaObj = new Date(fecha);
  let dia = String(fechaObj.getDate()).padStart(2, '0');
  let mes = String(fechaObj.getMonth() + 1).padStart(2, '0');
  let anio = fechaObj.getFullYear();
  let fechaPasada = (anio - 20) + "-" + mes + "-" + dia;

  getApod("https://api.nasa.gov/planetary/apod?api_key=" + apiKey + "&date=" + fecha, function(elegida) {
    getApod("https://api.nasa.gov/planetary/apod?api_key=" + apiKey + "&date=" + fechaPasada, function(pasada) {
      renderApod("comparacionUsuario", [
        { title: "Hace 20 años (" + fechaPasada + ")", date: pasada.date, url: pasada.url, media_type: pasada.media_type, explanation: pasada.explanation },
        { title: "Fecha elegida (" + fecha + ")", date: elegida.date, url: elegida.url, media_type: elegida.media_type, explanation: elegida.explanation }
      ]);
    });
  });
}


function mostrarAleatorias() {
  let cantidad = document.getElementById("cantidadFotos").value;
  if (!cantidad || cantidad < 1 || cantidad > 10) {
    alert("Por favor ingresa un número entre 1 y 10.");
    return;
  }

  getApod("https://api.nasa.gov/planetary/apod?api_key=" + apiKey + "&count=" + cantidad, function(aleatorias) {
    renderApod("fotosAleatorias", aleatorias);
  });
}


mostrarComparacionInicial();
