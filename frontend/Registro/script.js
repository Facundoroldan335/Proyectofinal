const API_URL = "http://127.0.0.1:8000";
async function registrarUsuario(event) {
    event.preventDefault()
    let usuario = {
        nombre: document.getElementById("nombre").value,
        email: document.getElementById("email").value
    };
    try {
        let respuesta = await fetch(API_URL + "/usuario/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(usuario)
        });
        if (!respuesta.ok) {
            alert("No se pudo registrar el usuario");
            return;
        }
        let resultado = await respuesta.json();
        localStorage.setItem("idUsuario", resultado.id);
        localStorage.setItem("nombreUsuario", usuario.nombre);
        alert("Usuario registrado correctamente");
        window.location.href = "../Principal/index.html";
    } catch (error) {
        console.log(error);
        alert("No se pudo conectar con el servidor");
    }
}
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("formRegistro").addEventListener("submit", registrarUsuario);
});
