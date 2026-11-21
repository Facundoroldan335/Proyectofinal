
// Dirección de nuestra API FastAPI.
const API_URL = "http://127.0.0.1:8000";

// Función para guardar una película en la base de datos.
async function agregarPelicula(event) {
    event.preventDefault();

    // Obtenemos los datos del formulario.
    let titulo = document.getElementById("titulo").value;
    let anio = document.getElementById("anio").value;
    let portada = document.getElementById("portada").value;
    let director = document.getElementById("director").value;
    let sinopsis = document.getElementById("sinopsis").value;

    // Creamos el objeto de la película.
    let pelicula = {
        titulo: titulo,
        anio: Number(anio),
        portada: portada,
        director: director,
        sinopsis: sinopsis
    };

    try {
        let respuesta = await fetch(API_URL + "/peliculas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(pelicula)
        });

        if (!respuesta.ok) {
            let error = await respuesta.json();
            alert("Error al guardar: " + JSON.stringify(error));
            return;
        }

        alert("Película guardada correctamente");

        document.getElementById("formPelicula").reset();

        // Actualizamos el catálogo.
        cargarPeliculas();

    } catch (error) {
        alert("No se pudo conectar con el servidor");
        console.log(error);
    }
}


// Función para consultar las películas guardadas.
async function cargarPeliculas() {
    try {
        let respuesta = await fetch(API_URL + "/peliculas");

        if (!respuesta.ok) {
            alert("Error al obtener las películas");
            return;
        }

        let peliculas = await respuesta.json();

        let contenedor = document.getElementById("peliculas");

        if (!contenedor) {
            console.log("No se encontró el contenedor con id peliculas");
            return;
        }

        contenedor.innerHTML = "";

        peliculas.forEach(function(pelicula) {

            let tarjeta = document.createElement("div");
            tarjeta.className = "tarjeta";

            tarjeta.innerHTML = `
                <img src="${pelicula.portada}" alt="Portada">
                <h3>${pelicula.titulo}</h3>
                <p>Año: ${pelicula.anio}</p>
                <p>Director: ${pelicula.director || "No especificado"}</p>
                <p>${pelicula.sinopsis || "Sin sinopsis"}</p>
            `;

            contenedor.appendChild(tarjeta);
        });

    } catch (error) {
        console.log("Error al cargar las películas:", error);
    }
}


// Cuando se envía el formulario, guardamos la película.
document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("formPelicula").addEventListener("submit", agregarPelicula);

    // Cargamos las películas al abrir la página.
    cargarPeliculas();

});
