
const API_URL = "http://127.0.0.1:8000";

let parametros = new URLSearchParams(window.location.search);
let idPelicula = parametros.get("id");

// Comprobar si el usuario está registrado
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

// Cargar información de la película
async function cargarPelicula() {
    try {
        let respuesta = await fetch(API_URL + "/peliculas/");
        let peliculas = await respuesta.json();

        let pelicula = peliculas.find(function(p) {
            return String(p.id) === String(idPelicula);
        });

        if (!pelicula) {
            document.getElementById("informacionPelicula").innerHTML =
                "<p>No se encontró la película.</p>";
            return;
        }

        let generos = (pelicula.generos || []).map(function(g) {
            return typeof g === "object" ? g.nombre : g;
        }).join(", ");

        document.getElementById("informacionPelicula").innerHTML = `
            <img src="${pelicula.portada}" alt="Portada">
            <div class="detalles-pelicula">
                <h2>${pelicula.titulo}</h2>
                <p><strong>Año:</strong> ${pelicula.anio}</p>
                <p><strong>Director:</strong> ${pelicula.director || "No especificado"}</p>
                <p><strong>Sinopsis:</strong> ${pelicula.sinopsis || "Sin sinopsis"}</p>
                <p><strong>Géneros:</strong> ${generos || "Sin géneros"}</p>
            </div>
        `;

    } catch (error) {
        console.log(error);
    }
}

// Cargar reseñas
async function cargarResenas() {
    try {
        let respuesta = await fetch(API_URL + "/resenas/");
        let resenas = await respuesta.json();

        let lista = document.getElementById("resenas");
        lista.innerHTML = "";

        let encontradas = resenas.filter(function(resena) {
            return String(resena.id_pelicula) === String(idPelicula);
        });

        if (encontradas.length === 0) {
            lista.innerHTML = "<p>Todavía no hay reseñas.</p>";
            return;
        }

        encontradas.forEach(function(resena) {
            let elemento = document.createElement("div");
            elemento.className = "resena";

            elemento.innerHTML = `
                <h3>Puntuación: ${resena.puntaje}/5</h3>
                <p>${resena.comentario || "Sin comentario"}</p>
            `;

            lista.appendChild(elemento);
        });

    } catch (error) {
        console.log(error);
    }
}

// Publicar reseña
async function publicarResena(event) {
    event.preventDefault();

    let idUsuario = localStorage.getItem("idUsuario");

    if (!idUsuario) {
        alert("Tenés que registrarte primero");
        return;
    }

    let resena = {
        id_usuario: idUsuario,
        id_pelicula: idPelicula,
        puntaje: Number(document.getElementById("puntaje").value),
        comentario: document.getElementById("comentario").value
    };

    try {
        let respuesta = await fetch(API_URL + "/resenas/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
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

// Iniciar
document.addEventListener("DOMContentLoaded", function() {
    comprobarUsuario();

    document.getElementById("formResena").addEventListener("submit", publicarResena);

    cargarPelicula();
    cargarResenas();
});
