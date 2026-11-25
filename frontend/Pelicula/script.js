const API_URL = "http://127.0.0.1:8000";

let idPelicula = new URLSearchParams(window.location.search).get("id");

// Muestra el formulario de reseña solo si se registro
function comprobarUsuario() {
    let idUsuario = localStorage.getItem("idUsuario");

    if (idUsuario) {
        document.getElementById("formResena").style.display = "block";
        document.getElementById("avisoRegistro").style.display = "none";
    } else {
        document.getElementById("formResena").style.display = "none";
        document.getElementById("avisoRegistro").style.display = "block";
    }
}

// Trae la pelicula y la muestra
async function cargarPelicula() {
    try {
        let respuesta = await fetch(API_URL + "/peliculas/");
        if (!respuesta.ok) {
            throw new Error("El servidor respondió " + respuesta.status);
        }
        let peliculas = await respuesta.json();

        let pelicula = null;
        for (let i = 0; i < peliculas.length; i++) {
            if (String(peliculas[i].id) === String(idPelicula)) {
                pelicula = peliculas[i];
            }
        }

        if (pelicula === null) {
            document.getElementById("informacionPelicula").innerHTML = "<p>No se encontró la película.</p>";
            return;
        }

        let generos = obtenerGeneros(pelicula);

        document.getElementById("informacionPelicula").innerHTML = `
            <img src="${pelicula.portada}" alt="Portada">
            <div class="detalles-pelicula">
                <h2>${pelicula.titulo}</h2>
                <p><strong>Año:</strong> ${pelicula.anio}</p>
                <p><strong>Director:</strong> ${pelicula.director || "No especificado"}</p>
                <p><strong>Sinopsis:</strong> ${pelicula.sinopsis || "Sin sinopsis"}</p>
                <p><strong>Géneros:</strong> ${generos}</p>
            </div>
        `;
    } catch (error) {
        console.log(error);
        document.getElementById("informacionPelicula").innerHTML = "<p>No se pudo cargar la película.</p>";
    }
}

// Junta los nombres de los generos
function obtenerGeneros(pelicula) {
    if (!pelicula.generos || pelicula.generos.length === 0) {
        return "Sin géneros";
    }

    let nombres = [];
    for (let i = 0; i < pelicula.generos.length; i++) {
        nombres.push(pelicula.generos[i].nombre);
    }

    return nombres.join(", ");
}

// Muestra las reseñas de esta pelicula
async function cargarResenas() {
    try {
        let respuesta = await fetch(API_URL + "/resenas/");
        if (!respuesta.ok) {
            throw new Error("El servidor respondió " + respuesta.status);
        }
        let resenas = await respuesta.json();
        let html = "";

        for (let i = 0; i < resenas.length; i++) {
            if (String(resenas[i].id_pelicula) === String(idPelicula)) {
                let comentario = resenas[i].comentario;
                if (!comentario) {
                    comentario = "Sin comentario";
                }

                html = html + `
                    <div class="resena">
                        <h3>Puntuación: ${resenas[i].puntaje}/5</h3>
                        <p>${comentario}</p>
                    </div>
                `;
            }
        }

        if (html === "") {
            html = "<p>Todavía no hay reseñas.</p>";
        }

        document.getElementById("resenas").innerHTML = html;
    } catch (error) {
        console.log(error);
        document.getElementById("resenas").innerHTML = "<p>No se pudieron cargar las reseñas.</p>";
    }
}

// Guarda la reseña nueva
async function publicarResena(event) {
    event.preventDefault();

    if (!localStorage.getItem("idUsuario")) {
        alert("Tenés que registrarte primero");
        return;
    }

    let resena = {
        id_usuario: localStorage.getItem("idUsuario"),
        id_pelicula: idPelicula,
        puntaje: Number(document.getElementById("puntaje").value),
        comentario: document.getElementById("comentario").value
    };

    try {
        let respuesta = await fetch(API_URL + "/resenas/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(resena)
        });

        if (!respuesta.ok) {
            alert("No se pudo publicar la reseña");
            return;
        }

        alert("Reseña publicada correctamente");
        document.getElementById("formResena").reset();
        cargarResenas();
    } catch (error) {
        console.log(error);
        alert("Error al conectar con el servidor");
    }
}
// Arranca la pagina
document.addEventListener("DOMContentLoaded", function () {
    comprobarUsuario();
    document.getElementById("formResena").addEventListener("submit", publicarResena);
    cargarPelicula();
    cargarResenas();
});