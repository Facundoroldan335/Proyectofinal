
const API_URL = "http://127.0.0.1:8000";

let idPelicula = new URLSearchParams(window.location.search).get("id");
let generosSeleccionados = [];

// Cargar los datos de la película
async function cargarPelicula() {
    try {
        let respuesta = await fetch(API_URL + "/peliculas/");
        let peliculas = await respuesta.json();

        let pelicula = peliculas.find(function(p) {
            return String(p.id) === String(idPelicula);
        });

        if (!pelicula) {
            alert("No se encontró la película");
            window.location.href = "../index.html";
            return;
        }

        document.getElementById("titulo").value = pelicula.titulo;
        document.getElementById("anio").value = pelicula.anio;
        document.getElementById("portada").value = pelicula.portada;
        document.getElementById("director").value = pelicula.director || "";
        document.getElementById("sinopsis").value = pelicula.sinopsis || "";

        generosSeleccionados = pelicula.generos || [];

        mostrarGeneros();

    } catch (error) {
        console.log(error);
        alert("No se pudo cargar la película");
    }
}

// Cargar géneros disponibles
async function cargarGeneros() {
    try {
        let respuesta = await fetch(API_URL + "/genero/");
        let generos = await respuesta.json();

        let selector = document.getElementById("genero");

        generos.forEach(function(genero) {
            let opcion = document.createElement("option");
            opcion.value = genero.id;
            opcion.textContent = genero.nombre;
            selector.appendChild(opcion);
        });

    } catch (error) {
        console.log(error);
    }
}

// Agregar un género
function agregarGenero() {
    let selector = document.getElementById("genero");
    let id = selector.value;

    if (id === "") {
        alert("Seleccioná un género");
        return;
    }

    let existe = generosSeleccionados.some(function(g) {
        return String(typeof g === "object" ? g.id : g) === String(id);
    });

    if (existe) {
        alert("Ese género ya está agregado");
        return;
    }

    generosSeleccionados.push({
        id: id,
        nombre: selector.options[selector.selectedIndex].text
    });

    mostrarGeneros();
    selector.value = "";
}

// Mostrar los géneros
function mostrarGeneros() {
    let lista = document.getElementById("listaGeneros");
    lista.innerHTML = "";

    generosSeleccionados.forEach(function(genero, indice) {
        let nombre = typeof genero === "object" ? genero.nombre : genero;

        let elemento = document.createElement("div");
        elemento.textContent = nombre;

        let boton = document.createElement("button");
        boton.type = "button";
        boton.textContent = "Quitar";

        boton.addEventListener("click", function() {
            generosSeleccionados.splice(indice, 1);
            mostrarGeneros();
        });

        elemento.appendChild(boton);
        lista.appendChild(elemento);
    });
}

// Guardar los cambios
async function guardarCambios(event) {
    event.preventDefault();

    if (!localStorage.getItem("idUsuario")) {
        alert("Tenés que registrarte para editar");
        return;
    }

    let pelicula = {
        titulo: document.getElementById("titulo").value,
        anio: Number(document.getElementById("anio").value),
        portada: document.getElementById("portada").value,
        director: document.getElementById("director").value,
        sinopsis: document.getElementById("sinopsis").value,
        generos: generosSeleccionados.map(function(g) {
            return typeof g === "object" ? g.id : g;
        })
    };

    try {
        let respuesta = await fetch(API_URL + "/peliculas/" + idPelicula, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(pelicula)
        });

        if (!respuesta.ok) {
            alert("No se pudieron guardar los cambios");
            return;
        }

        alert("Película actualizada correctamente");
        window.location.href = "../index.html";

    } catch (error) {
        console.log(error);
        alert("No se pudo conectar con el servidor");
    }
}

// Iniciar
document.addEventListener("DOMContentLoaded", function() {
    if (!localStorage.getItem("idUsuario")) {
        alert("Tenés que registrarte para editar películas");
        window.location.href = "../../Registro/index.html";
        return;
    }

    document.getElementById("formEditar").addEventListener("submit", guardarCambios);
    document.getElementById("btnAgregarGenero").addEventListener("click", agregarGenero);

    cargarGeneros();
    cargarPelicula();
});
