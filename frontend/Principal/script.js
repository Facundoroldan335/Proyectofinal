
const API_URL = "http://127.0.0.1:8000";

let generosSeleccionados = [];
let peliculasCargadas = [];

// Comprobar si el usuario está registrado
function comprobarUsuario() {
    let idUsuario = localStorage.getItem("idUsuario");
    let nombreUsuario = localStorage.getItem("nombreUsuario");

    if (idUsuario) {
        document.getElementById("agregar").style.display = "block";
        document.getElementById("linkRegistro").style.display = "none";
        document.getElementById("estadoUsuario").textContent = "Hola, " + nombreUsuario;
    } else {
        document.getElementById("agregar").style.display = "none";
        document.getElementById("linkRegistro").style.display = "inline";
        document.getElementById("estadoUsuario").textContent = "";
    }
}

// Cargar géneros
async function cargarGeneros() {
    try {
        let respuesta = await fetch(API_URL + "/genero/");
        let generos = await respuesta.json();

        let filtro = document.getElementById("generoFiltro");
        let selector = document.getElementById("generoAgregar");

        generos.forEach(function(genero) {
            let opcion1 = document.createElement("option");
            opcion1.value = genero.id;
            opcion1.textContent = genero.nombre;
            filtro.appendChild(opcion1);

            let opcion2 = document.createElement("option");
            opcion2.value = genero.id;
            opcion2.textContent = genero.nombre;
            selector.appendChild(opcion2);
        });

    } catch (error) {
        console.log("Error al cargar géneros:", error);
    }
}

// Agregar género a la película
function agregarGenero() {
    let selector = document.getElementById("generoAgregar");
    let id = selector.value;

    if (id === "") {
        alert("Seleccioná un género");
        return;
    }

    let existe = generosSeleccionados.some(function(genero) {
        return String(genero.id) === String(id);
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

// Mostrar géneros seleccionados
function mostrarGeneros() {
    let lista = document.getElementById("listaGeneros");
    lista.innerHTML = "";

    generosSeleccionados.forEach(function(genero, indice) {
        let elemento = document.createElement("div");
        elemento.textContent = genero.nombre;

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

// Agregar película
async function agregarPelicula(event) {
    event.preventDefault();

    if (!localStorage.getItem("idUsuario")) {
        alert("Tenés que registrarte primero");
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
            alert("Error al guardar la película");
            return;
        }

        alert("Película guardada correctamente");

        document.getElementById("formPelicula").reset();
        generosSeleccionados = [];
        mostrarGeneros();

        cargarPeliculas();

    } catch (error) {
        console.log(error);
        alert("No se pudo conectar con el servidor");
    }
}

// Obtener nombres de los géneros
function obtenerGeneros(pelicula) {
    if (!pelicula.generos || pelicula.generos.length === 0) {
        return "Sin géneros";
    }

    return pelicula.generos.map(function(genero) {
        return typeof genero === "object" ? genero.nombre : genero;
    }).join(", ");
}

// Mostrar películas
function mostrarPeliculas(lista) {
    let contenedor = document.getElementById("peliculas");
    contenedor.innerHTML = "";

    if (lista.length === 0) {
        contenedor.innerHTML = "<p>No se encontraron películas.</p>";
        return;
    }

    lista.forEach(function(pelicula) {
        let tarjeta = document.createElement("div");
        tarjeta.className = "tarjeta";

        tarjeta.innerHTML = `
            <img src="${pelicula.portada}" alt="Portada">
            <h3>${pelicula.titulo}</h3>
            <p>Año: ${pelicula.anio}</p>
            <p>Director: ${pelicula.director || "No especificado"}</p>
            <p>Géneros: ${obtenerGeneros(pelicula)}</p>
            <a href="../Pelicula/index.html?id=${encodeURIComponent(pelicula.id)}">
                Ver película y reseñas
            </a>
        `;

        if (localStorage.getItem("idUsuario")) {
            let botonEditar = document.createElement("button");
            botonEditar.textContent = "Editar";

            botonEditar.addEventListener("click", function() {
                window.location.href = "Editar/index.html?id=" + encodeURIComponent(pelicula.id);
            });

            let botonEliminar = document.createElement("button");
            botonEliminar.textContent = "Eliminar";

            botonEliminar.addEventListener("click", function() {
                eliminarPelicula(pelicula.id);
            });

            tarjeta.appendChild(botonEditar);
            tarjeta.appendChild(botonEliminar);
        }

        contenedor.appendChild(tarjeta);
    });
}

// Buscar películas
function buscarPeliculas() {
    let texto = document.getElementById("buscar").value.toLowerCase();
    let genero = document.getElementById("generoFiltro").value;

    let resultado = peliculasCargadas.filter(function(pelicula) {
        let coincideTexto =
            pelicula.titulo.toLowerCase().includes(texto) ||
            (pelicula.director || "").toLowerCase().includes(texto);

        let coincideGenero = genero === "" ||
            (pelicula.generos || []).some(function(g) {
                return String(typeof g === "object" ? g.id : g) === String(genero);
            });

        return coincideTexto && coincideGenero;
    });

    mostrarPeliculas(resultado);
}

// Cargar películas
async function cargarPeliculas() {
    try {
        let respuesta = await fetch(API_URL + "/peliculas/");

        if (!respuesta.ok) {
            throw new Error("Error al cargar películas");
        }

        peliculasCargadas = await respuesta.json();
        buscarPeliculas();

    } catch (error) {
        console.log(error);
        document.getElementById("peliculas").innerHTML =
            "<p>No se pudieron cargar las películas.</p>";
    }
}

// Eliminar película
async function eliminarPelicula(id) {
    if (!localStorage.getItem("idUsuario")) {
        alert("Tenés que registrarte primero");
        return;
    }

    let confirmar = confirm("¿Querés eliminar esta película?");

    if (!confirmar) {
        return;
    }

    try {
        let respuesta = await fetch(API_URL + "/peliculas/" + id, {
            method: "DELETE"
        });

        if (!respuesta.ok) {
            alert("No se pudo eliminar la película");
            return;
        }

        alert("Película eliminada correctamente");
        cargarPeliculas();

    } catch (error) {
        console.log(error);
        alert("Error al conectar con el servidor");
    }
}

// Iniciar
document.addEventListener("DOMContentLoaded", function() {
    comprobarUsuario();

    document.getElementById("formPelicula").addEventListener("submit", agregarPelicula);
    document.getElementById("btnAgregarGenero").addEventListener("click", agregarGenero);
    document.getElementById("btnBuscar").addEventListener("click", buscarPeliculas);
    document.getElementById("buscar").addEventListener("keyup", buscarPeliculas);
    document.getElementById("generoFiltro").addEventListener("change", buscarPeliculas);

    cargarGeneros();
    cargarPeliculas();
});
