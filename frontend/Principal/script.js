const API_URL = "http://127.0.0.1:8000";

let generosSeleccionados = [];
let peliculasCargadas = [];
// Comprobar si el usuario está registrado
function comprobarUsuario() {
    let idUsuario = localStorage.getItem("idUsuario");
    let nombreUsuario = localStorage.getItem("nombreUsuario");
    let formulario = document.getElementById("agregar");
    let linkRegistro = document.getElementById("linkRegistro");
    let estadoUsuario = document.getElementById("estadoUsuario");
    if (idUsuario) {
        formulario.style.display = "block";
        linkRegistro.style.display = "none";
        estadoUsuario.textContent = "Hola, " + (nombreUsuario || "usuario");
    } else {
        formulario.style.display = "none";
        linkRegistro.style.display = "inline";
        estadoUsuario.textContent = "";
    }
}
// Cargar los géneros existentes
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
// Agregar un género a la lista de la película
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
// Obtener los nombres de los géneros de una película
function obtenerNombresGeneros(pelicula) {
    if (!pelicula.generos || pelicula.generos.length === 0) {
        return "Sin géneros";
    }
    return pelicula.generos.map(function(genero) {
        if (typeof genero === "object") {
            return genero.nombre;
        }
        return genero;
    }).join(", ");
}
// Comprobar si una película tiene el género seleccionado
function tieneGenero(pelicula, idGenero) {
    if (!pelicula.generos) {
        return false;
    }
    return pelicula.generos.some(function(genero) {
        if (typeof genero === "object") {
            return genero.id === idGenero;
        }
        return genero === idGenero;
    });
}
// Guardar una película
async function agregarPelicula(event) {
    event.preventDefault();
    // Volver a comprobar que el usuario esté registrado
    let idUsuario = localStorage.getItem("idUsuario");
    if (!idUsuario) {
        alert("Tenés que registrarte para agregar una película.");
        document.getElementById("agregar").style.display = "none";
        return;
    }
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
// Mostrar las películas en pantalla
function mostrarPeliculas(listaPeliculas) {
    let contenedor = document.getElementById("peliculas");
    contenedor.innerHTML = "";
    if (listaPeliculas.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron películas.</p>";
        return;
    }
    listaPeliculas.forEach(function(pelicula) {
        let tarjeta = document.createElement("div");
        tarjeta.className = "tarjeta";
        tarjeta.innerHTML = `
            <img src="${pelicula.portada}" alt="Portada de ${pelicula.titulo}">
            <h3>${pelicula.titulo}</h3>
            <p>Año: ${pelicula.anio}</p>
            <p>Director: ${pelicula.director || "No especificado"}</p>
            <p>Géneros: ${obtenerNombresGeneros(pelicula)}</p>
            <a href="../Pelicula/index.html?id=${encodeURIComponent(pelicula.id)}">
                Ver película y reseñas
            </a>
        `;
        contenedor.appendChild(tarjeta);
    });
}
// Aplicar los filtros de búsqueda
function buscarPeliculas() {
    let texto = document.getElementById("buscar").value.toLowerCase();
    let generoSeleccionado = document.getElementById("generoFiltro").value;
    let resultado = peliculasCargadas.filter(function(pelicula) {
        let coincideTexto =
            pelicula.titulo.toLowerCase().includes(texto) ||
            (pelicula.director || "").toLowerCase().includes(texto);
        let coincideGenero = generoSeleccionado === "" ||
            tieneGenero(pelicula, generoSeleccionado);
        return coincideTexto && coincideGenero;
    });

    mostrarPeliculas(resultado);
}
// Cargar las películas desde la API
async function cargarPeliculas() {
    try {
        let respuesta = await fetch(API_URL + "/peliculas/");
        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar las películas");
        }
        peliculasCargadas = await respuesta.json();
        mostrarPeliculas(peliculasCargadas);
    } catch (error) {
        console.log("Error al cargar películas:", error);
        document.getElementById("peliculas").innerHTML =
            "<p>No se pudieron cargar las películas.</p>";
    }
}
let idUsuario = localStorage.getItem("idUsuario");

if (idUsuario) {
    let botonEliminar = document.createElement("button");
    botonEliminar.textContent = "Eliminar";

    botonEliminar.addEventListener("click", function() {
        eliminarPelicula(pelicula.id);
    });

    tarjeta.appendChild(botonEliminar);
}
// Iniciar las funciones
document.addEventListener("DOMContentLoaded", function() {
    comprobarUsuario();
    document.getElementById("formPelicula").addEventListener(
        "submit",
        agregarPelicula
    );
    document.getElementById("btnAgregarGenero").addEventListener(
        "click",
        agregarGenero
    );
    document.getElementById("btnBuscar").addEventListener(
        "click",
        buscarPeliculas
    );
    document.getElementById("buscar").addEventListener(
        "keyup",
        buscarPeliculas
    );
    document.getElementById("generoFiltro").addEventListener(
        "change",
        buscarPeliculas
    );
    cargarGeneros();
    cargarPeliculas();
});
