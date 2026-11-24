const API_URL = "http://127.0.0.1:8000";
// Obtener el ID de la película desde la URL
const parametros = new URLSearchParams(window.location.search);
const idPelicula = parametros.get("id");
// Obtener los elementos del HTML
const informacionPelicula = document.getElementById("informacionPelicula");
const formularioResena = document.getElementById("formResena");
const listaResenas = document.getElementById("resenas");
// Comprobar si el usuario está registrado
function comprobarUsuario() {
    let idUsuario = localStorage.getItem("idUsuario");
    let aviso = document.getElementById("avisoRegistro");
    if (idUsuario) {
        formularioResena.style.display = "block";
        aviso.style.display = "none";
    } else {
        formularioResena.style.display = "none";
        aviso.style.display = "block";
    }
}
// Cargar información de la película
async function cargarPelicula() {
    try {
        let respuesta = await fetch(API_URL + "/peliculas/");
        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar las películas");
        }
        let peliculas = await respuesta.json();
        let pelicula = peliculas.find(function(p) {
            return p.id === idPelicula;
        });
        if (!pelicula) {
            informacionPelicula.innerHTML = "<p>No se encontró la película.</p>";
            return;
        }
        let generos = pelicula.generos || [];
        let nombresGeneros = generos.map(function(genero) {
            if (typeof genero === "object") {
                return genero.nombre;
            }
            return genero;
        }).join(", ");
        informacionPelicula.innerHTML = `
            <img src="${pelicula.portada}" alt="${pelicula.titulo}">
            <div class="detalles-pelicula">
                <h2>${pelicula.titulo}</h2>
                <p><strong>Año:</strong> ${pelicula.anio}</p>
                <p><strong>Director:</strong> ${pelicula.director || "No especificado"}</p>
                <p><strong>Sinopsis:</strong> ${pelicula.sinopsis || "Sin sinopsis"}</p>
                <p><strong>Géneros:</strong> ${nombresGeneros || "Sin géneros"}</p>
            </div>
        `;
    } catch (error) {
        console.log("Error al cargar película:", error);
    }
}
// Cargar las reseñas de la película
async function cargarResenas() {
    try {
        let respuesta = await fetch(API_URL + "/resenas/");
        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar las reseñas");
        }
        let resenas = await respuesta.json();
        let resenasPelicula = resenas.filter(function(resena) {
            return resena.id_pelicula === idPelicula;
        });
        listaResenas.innerHTML = "";
        if (resenasPelicula.length === 0) {
            listaResenas.innerHTML = "<p>Todavía no hay reseñas para esta película.</p>";
            return;
        }
        resenasPelicula.forEach(function(resena) {
            let elemento = document.createElement("div");
            elemento.className = "resena";
            elemento.innerHTML = `
                <h3>Puntuación: ${resena.puntaje}/5</h3>
                <p>${resena.comentario || "Sin comentario"}</p>
            `;
            listaResenas.appendChild(elemento);
        });
    } catch (error) {
        console.log("Error al cargar reseñas:", error);
    }
}
// Publicar una reseña
formularioResena.addEventListener("submit", async function(event) {
    event.preventDefault();
    let idUsuario = localStorage.getItem("idUsuario");
    if (!idUsuario) {
        alert("Primero tenés que registrarte.");
        comprobarUsuario();
        return;
    }
    let resena = {
        id_usuario: idUsuario,
        id_pelicula: idPelicula,
        puntaje: parseInt(document.getElementById("puntaje").value),
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
            let error = await respuesta.json();
            alert("Error al publicar reseña: " + JSON.stringify(error));
            return;
        }
        alert("Reseña publicada correctamente.");
        formularioResena.reset();
        await cargarResenas();
    } catch (error) {
        console.log("Error:", error);
        alert("No se pudo conectar con el servidor.");
    }
});
// Ejecutar las funciones al abrir la página
comprobarUsuario();
cargarPelicula();
cargarResenas();
