const API_URL = "http://127.0.0.1:8000";

let idPelicula = new URLSearchParams(window.location.search).get("id");
let generosElegidos = [];

// Trae la pelicula y completa el formulario
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
            alert("No se encontró la película");
            window.location.href = "../index.html";
            return;
        }

        document.getElementById("titulo").value = pelicula.titulo;
        document.getElementById("anio").value = pelicula.anio;
        document.getElementById("portada").value = pelicula.portada;
        document.getElementById("director").value = pelicula.director || "";
        document.getElementById("sinopsis").value = pelicula.sinopsis || "";

        generosElegidos = pelicula.generos || [];
        mostrarGeneros();
    } catch (error) {
        console.log(error);
        alert("No se pudo cargar la película");
    }
}

// Carga los generos en el select
async function cargarGeneros() {
    try {
        let respuesta = await fetch(API_URL + "/genero/");
        if (!respuesta.ok) {
            throw new Error("El servidor respondió " + respuesta.status);
        }
        let generos = await respuesta.json();
        let selector = document.getElementById("genero");

        for (let i = 0; i < generos.length; i++) {
            let opcion = document.createElement("option");
            opcion.value = generos[i].id;
            opcion.textContent = generos[i].nombre;
            selector.appendChild(opcion);
        }
    } catch (error) {
        console.log(error);
    }
}

// Agrega un genero mas a la pelicula
function agregarGenero() {
    let selector = document.getElementById("genero");
    let id = selector.value;

    if (id === "") {
        alert("Seleccioná un género");
        return;
    }

    for (let i = 0; i < generosElegidos.length; i++) {
        if (String(generosElegidos[i].id) === String(id)) {
            alert("Ese género ya está agregado");
            return;
        }
    }

    let nombre = selector.options[selector.selectedIndex].text;
    generosElegidos.push({ id: id, nombre: nombre });

    mostrarGeneros();
    selector.value = "";
}

// Dibuja los generos que tiene la pelicula
function mostrarGeneros() {
    let lista = document.getElementById("listaGeneros");
    lista.innerHTML = "";

    for (let i = 0; i < generosElegidos.length; i++) {
        let fila = document.createElement("div");
        fila.textContent = generosElegidos[i].nombre;

        let boton = document.createElement("button");
        boton.type = "button";
        boton.textContent = "Quitar";

        boton.addEventListener("click", function () {
            generosElegidos.splice(i, 1);
            mostrarGeneros();
        });

        fila.appendChild(boton);
        lista.appendChild(fila);
    }
}

// Guarda los cambios
async function guardarCambios(event) {
    event.preventDefault();

    if (!localStorage.getItem("idUsuario")) {
        alert("Tenés que registrarte para editar");
        return;
    }

    let idsGeneros = [];
    for (let i = 0; i < generosElegidos.length; i++) {
        idsGeneros.push(generosElegidos[i].id);
    }

    let pelicula = {
        titulo: document.getElementById("titulo").value,
        anio: Number(document.getElementById("anio").value),
        portada: document.getElementById("portada").value,
        director: document.getElementById("director").value,
        sinopsis: document.getElementById("sinopsis").value,
        generos: idsGeneros
    };

    try {
        let respuesta = await fetch(API_URL + "/peliculas/" + idPelicula, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
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

// Arranca la pagina
document.addEventListener("DOMContentLoaded", function () {
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