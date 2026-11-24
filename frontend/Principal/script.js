const API_URL = "http://127.0.0.1:8000";

let generosSeleccionados = [];

// Cargar géneros existentes
async function cargarGeneros() {
    try {
        let respuesta = await fetch(API_URL + "/genero/");

        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar los géneros");
        }

        let generos = await respuesta.json();

        let filtro = document.getElementById("generoFiltro");
        let selector = document.getElementById("generoAgregar");

        generos.forEach(function(genero) {
            let opcionFiltro = document.createElement("option");
            opcionFiltro.value = genero.id;
            opcionFiltro.textContent = genero.nombre;
            filtro.appendChild(opcionFiltro);

            let opcionAgregar = document.createElement("option");
            opcionAgregar.value = genero.id;
            opcionAgregar.textContent = genero.nombre;
            selector.appendChild(opcionAgregar);
        });

    } catch (error) {
        console.log("Error al cargar géneros:", error);
    }
}

// Agregar un género a la lista
function agregarGenero() {
    let selector = document.getElementById("generoAgregar");

    let idGenero = selector.value;
    let nombreGenero = selector.options[selector.selectedIndex].text;

    if (idGenero === "") {
        alert("Seleccioná un género");
        return;
    }

    let existe = generosSeleccionados.some(function(genero) {
        return genero.id === idGenero;
    });

    if (existe) {
        alert("Ese género ya fue agregado");
        return;
    }

    generosSeleccionados.push({
        id: idGenero,
        nombre: nombreGenero
    });

    mostrarGenerosSeleccionados();

    selector.value = "";
}

// Mostrar los géneros seleccionados
function mostrarGenerosSeleccionados() {
    let contenedor = document.getElementById("listaGeneros");

    contenedor.innerHTML = "";

    generosSeleccionados.forEach(function(genero, indice) {
        let elemento = document.createElement("div");

        let nombre = document.createElement("span");
        nombre.textContent = genero.nombre;

        let boton = document.createElement("button");
        boton.type = "button";
        boton.textContent = "Quitar";

        boton.addEventListener("click", function() {
            generosSeleccionados.splice(indice, 1);
            mostrarGenerosSeleccionados();
        });

        elemento.appendChild(nombre);
        elemento.appendChild(boton);

        contenedor.appendChild(elemento);
    });
}

// Guardar una película con sus géneros
async function agregarPelicula(event) {
    event.preventDefault();

    let pelicula = {
        titulo: document.getElementById("titulo").value,
        anio: Number(document.getElementById("anio").value),
        portada: document.getElementById("portada").value,
        director: document.getElementById("director").value,
        sinopsis: document.getElementById("sinopsis").value,
        generos: generosSeleccionados.map(function(genero) {
            return genero.id;
        })
    };

    try {
        let respuesta = await fetch(API_URL + "/peliculas/", {
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

        generosSeleccionados = [];
        mostrarGenerosSeleccionados();

        await cargarPeliculas();

    } catch (error) {
        console.log("Error:", error);
        alert("No se pudo conectar con el servidor");
    }
}

// Mostrar las películas guardadas
async function cargarPeliculas() {
    try {
        let respuesta = await fetch(API_URL + "/peliculas/");

        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar las películas");
        }

        let peliculas = await respuesta.json();

        let contenedor = document.getElementById("peliculas");

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
                <p>Géneros: ${pelicula.generos.map(function(genero) {
                    return genero.nombre;
                }).join(", ") || "Sin géneros"}</p>
            `;

            contenedor.appendChild(tarjeta);
        });

    } catch (error) {
        console.log("Error al cargar películas:", error);
    }
}

// Iniciar las funciones
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("formPelicula").addEventListener(
        "submit",
        agregarPelicula
    );

    document.getElementById("btnAgregarGenero").addEventListener(
        "click",
        agregarGenero
    );

    cargarGeneros();
    cargarPeliculas();
});