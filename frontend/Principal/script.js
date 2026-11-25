const API_URL = "http://127.0.0.1:8000";

let generosElegidos = [];
let peliculasCargadas = [];

function comprobarUsuario() {
    let registrado = localStorage.getItem("idUsuario");
    let estado = document.getElementById("estadoUsuario");
    document.getElementById("agregar").style.display = registrado ? "block" : "none";
    document.getElementById("linkRegistro").style.display = registrado ? "inline" : "none";
    estado.textContent = registrado ? "Cerrar sesión" : "";
    estado.style.cursor = registrado ? "pointer" : "default";
    estado.tabIndex = registrado ? 0 : -1;
}

function cerrarSesion() {
    if (!localStorage.getItem("idUsuario")) {
        return;
    }
    localStorage.removeItem("idUsuario");
    localStorage.removeItem("nombreUsuario");
    window.location.reload();
}

async function cargarGeneros() {
    try {
        let respuesta = await fetch(API_URL + "/genero/");
        if (!respuesta.ok) {
            throw new Error("El servidor respondió " + respuesta.status);
        }
        let generos = await respuesta.json();
        let filtro = document.getElementById("generoFiltro");
        let selector = document.getElementById("generoAgregar");
        for (let i = 0; i < generos.length; i++) {
            filtro.appendChild(new Option(generos[i].nombre, generos[i].id));
            selector.appendChild(new Option(generos[i].nombre, generos[i].id));
        }
    } catch (error) {
        console.log("Error al cargar los generos", error);
    }
}

function agregarGenero() {
    let selector = document.getElementById("generoAgregar");
    if (selector.value === "") {
        alert("Seleccioná un género");
        return;
    }
    for (let i = 0; i < generosElegidos.length; i++) {
        if (String(generosElegidos[i].id) === String(selector.value)) {
            alert("Ese género ya está agregado");
            return;
        }
    }
    let nombre = selector.options[selector.selectedIndex].text;
    generosElegidos.push({ id: selector.value, nombre: nombre });
    mostrarGeneros();
    selector.value = "";
}

function quitarGenero(posicion) {
    generosElegidos.splice(posicion, 1);
    mostrarGeneros();
}

function mostrarGeneros() {
    let html = "";
    for (let i = 0; i < generosElegidos.length; i++) {
        html += `<div>${generosElegidos[i].nombre}
        <button type="button" onclick="quitarGenero(${i})">Quitar</button></div>`;
    }
    document.getElementById("listaGeneros").innerHTML = html;
}

async function agregarPelicula(event) {
    event.preventDefault();
    if (!localStorage.getItem("idUsuario")) {
        alert("Tenés que registrarte primero");
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
        let respuesta = await fetch(API_URL + "/peliculas/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pelicula)
        });
        if (!respuesta.ok) {
            alert("Error al guardar la película");
            return;
        }
        alert("Película guardada correctamente");
        document.getElementById("formPelicula").reset();
        generosElegidos = [];
        mostrarGeneros();
        cargarPeliculas();
    } catch (error) {
        console.log(error);
        alert("No se pudo conectar con el servidor");
    }
}

function obtenerGeneros(pelicula) {
    let generos = pelicula.generos || [];
    let nombres = [];
    for (let i = 0; i < generos.length; i++) {
        nombres.push(generos[i].nombre);
    }
    return nombres.join(", ") || "Sin géneros";
}

function mostrarPeliculas(lista) {
    let html = "";
    let registrado = localStorage.getItem("idUsuario");
    for (let i = 0; i < lista.length; i++) {
        let p = lista[i];
        let botones = "";
        if (registrado) {
            botones = `<button onclick="editarPelicula('${p.id}')">Editar</button>
            <button onclick="eliminarPelicula('${p.id}')">Eliminar</button>`;
        }
        html += `
            <div class="tarjeta">
                <img src="${p.portada}" alt="Portada">
                <h3>${p.titulo}</h3>
                <p>Año: ${p.anio}</p>
                <p>Director: ${p.director || "No especificado"}</p>
                <p>Géneros: ${obtenerGeneros(p)}</p>
                <a href="../Pelicula/index.html?id=${encodeURIComponent(p.id)}">Ver película y reseñas</a>
                ${botones}
            </div>
        `;
    }
    if (html === "") {
        html = "<p>No se encontraron películas.</p>";
    }
    document.getElementById("peliculas").innerHTML = html;
}

function editarPelicula(id) {
    window.location.href = "Editar/index.html?id=" + encodeURIComponent(id);
}

function buscarPeliculas() {
    let texto = document.getElementById("buscar").value.toLowerCase();
    let genero = document.getElementById("generoFiltro").value;
    let resultado = [];
    for (let i = 0; i < peliculasCargadas.length; i++) {
        let p = peliculasCargadas[i];
        let titulo = p.titulo.toLowerCase();
        let director = (p.director || "").toLowerCase();
        let textoOk = titulo.includes(texto) || director.includes(texto);
        let generoOk = genero === "";
        let generos = p.generos || [];
        for (let j = 0; j < generos.length; j++) {
            if (String(generos[j].id) === String(genero)) {
                generoOk = true;
            }
        }
        if (textoOk && generoOk) {
            resultado.push(p);
        }
    }
    mostrarPeliculas(resultado);
}

async function cargarPeliculas() {
    try {
        let respuesta = await fetch(API_URL + "/peliculas/");
        if (!respuesta.ok) {
            throw new Error("El servidor respondió " + respuesta.status);
        }
        peliculasCargadas = await respuesta.json();
        buscarPeliculas();
    } catch (error) {
        console.log("ERROR:", error);
        document.getElementById("peliculas").innerHTML = "<p>No se pudieron cargar las películas.</p>";
    }
}

async function eliminarPelicula(id) {
    if (!confirm("¿Querés eliminar esta película?")) {
        return;
    }
    try {
        let respuesta = await fetch(API_URL + "/peliculas/" + id, { method: "DELETE" });
        if (!respuesta.ok) {
            alert("No se pudo eliminar la película");
            return;
        }
        alert("Película eliminada correctamente");
        cargarPeliculas();
    } catch (error) {
        console.log(error);
        alert("No se pudo conectar con el servidor");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    comprobarUsuario();
    document.getElementById("formPelicula").addEventListener("submit", agregarPelicula);
    document.getElementById("btnAgregarGenero").addEventListener("click", agregarGenero);
    document.getElementById("btnBuscar").addEventListener("click", buscarPeliculas);
    document.getElementById("generoFiltro").addEventListener("change", buscarPeliculas);
    document.getElementById("estadoUsuario").addEventListener("click", cerrarSesion);
    document.getElementById("estadoUsuario").addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            cerrarSesion();
        }
    });
    document.getElementById("buscar").addEventListener("input", function () {
        if (document.getElementById("buscar").value === "") {
            buscarPeliculas();
        }
    });
    cargarGeneros();
    cargarPeliculas();
});