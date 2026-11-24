const API_URL = "http://127.0.0.1:8000";

// Obtenemos el ID de la película desde la URL
const parametros = new URLSearchParams(window.location.search);
const idPelicula = parametros.get("id");

// Obtenemos los elementos del HTML
const informacionPelicula = document.getElementById("informacionPelicula");
const formularioResena = document.getElementById("formResena");
const listaResenas = document.getElementById("resenas");

// Cargar información de la película
async function cargarPelicula() {

    try {

        let respuesta = await fetch(API_URL + "/peliculas/");

        let peliculas = await respuesta.json();

        let pelicula = peliculas.find(p => p.id === idPelicula);

        if (!pelicula) {
            informacionPelicula.innerHTML = "<p>No se encontró la película.</p>";
            return;
        }

        informacionPelicula.innerHTML = `
            <img src="${pelicula.portada}" alt="${pelicula.titulo}">

            <div class="detalles-pelicula">
                <h2>${pelicula.titulo}</h2>
                <p><strong>Año:</strong> ${pelicula.anio}</p>
                <p><strong>Director:</strong> ${pelicula.director || "No especificado"}</p>
                <p><strong>Sinopsis:</strong> ${pelicula.sinopsis || "Sin sinopsis"}</p>
                <p><strong>Géneros:</strong> ${pelicula.generos.join(", ")}</p>
            </div>
        `;

    } catch (error) {
        console.log("Error al cargar película:", error);
    }

}

// Cargar reseñas de la película
async function cargarResenas() {

    try {

        let respuesta = await fetch(API_URL + "/resenas/resenas");

        let resenas = await respuesta.json();

        let resenasPelicula = resenas.filter(r => r.id_pelicula === idPelicula);

        listaResenas.innerHTML = "";

        if (resenasPelicula.length === 0) {
            listaResenas.innerHTML = "<p>Todavía no hay reseñas para esta película.</p>";
            return;
        }

        resenasPelicula.forEach(resena => {

            listaResenas.innerHTML += `
                <div class="resena">
                    <h3>Puntuación: ${resena.puntaje}/5</h3>
                    <p>${resena.comentario || "Sin comentario"}</p>
                </div>
            `;

        });

    } catch (error) {
        console.log("Error al cargar reseñas:", error);
    }

}

// Registrar una reseña
formularioResena.addEventListener("submit", async function(event) {

    event.preventDefault();

    let idUsuario = localStorage.getItem("idUsuario");

    if (!idUsuario) {
        alert("Primero tenés que registrarte.");
        window.location.href = "registro.html";
        return;
    }

    let resena = {
        id_usuario: idUsuario,
        id_pelicula: idPelicula,
        puntaje: parseInt(document.getElementById("puntaje").value),
        comentario: document.getElementById("comentario").value
    };

    try {

        let respuesta = await fetch(API_URL + "/resenas/resenas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(resena)
        });

        if (!respuesta.ok) {
            let error = await respuesta.json();
            alert("Error al publicar reseña: " + JSON.stringify(error));
            return;
        }

        alert("Reseña publicada correctamente.");

        formularioResena.reset();

        cargarResenas();

    } catch (error) {
        console.log("Error:", error);
        alert("No se pudo conectar con el servidor.");
    }

});

// Ejecutar las funciones al abrir la página
cargarPelicula();
cargarResenas();
