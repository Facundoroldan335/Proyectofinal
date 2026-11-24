const API_URL = "http://127.0.0.1:8000";

document.getElementById("formRegistro").addEventListener("submit", async function(event) {
    event.preventDefault();
    let usuario = {
        nombre: document.getElementById("nombre").value,
        email: document.getElementById("email").value
    };
    try {
        let respuesta = await fetch(API_URL + "/usuario/usuarios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(usuario)
        });
        if (!respuesta.ok) {
            let error = await respuesta.json();
            alert("Error al registrar: " + JSON.stringify(error));
            return;
        }
        let resultado = await respuesta.json();
        localStorage.setItem("idUsuario", resultado.id);
        localStorage.setItem("nombreUsuario", usuario.nombre);
        alert("Usuario registrado correctamente");
        window.location.href = "../Principal/index.html";
    } catch (error) {
        console.log("Error:", error);
        alert("No se pudo conectar con el servidor");
    }
});