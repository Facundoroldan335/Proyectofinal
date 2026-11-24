from fastapi import APIRouter, Depends
import psycopg
from conexion import getConexion
from backend.model.usuarioModel import UsuarioModel
from backend.manager.usuarioManager import UsuarioManager

router = APIRouter(prefix="/usuario", tags=["usuario"])
usuarioManager = UsuarioManager()

@router.get("/")
def leerUsuarios(conexion: psycopg.Connection = Depends(getConexion)):
    return usuarioManager.leerUsuarios(conexion)

@router.post("/")
def agregarUsuario(usuario: UsuarioModel, conexion: psycopg.Connection = Depends(getConexion)):
    id_usuario = usuarioManager.agregarUsuario(usuario.nombre, usuario.email, conexion)
    return {
        "mensaje": "Usuario agregado correctamente",
        "id": str(id_usuario)
    }
@router.put("/{id}")
def actualizarUsuario(id: str, usuario: UsuarioModel, conexion: psycopg.Connection = Depends(getConexion)):
    usuarioManager.actualizarUsuario(id, usuario.nombre, usuario.email, conexion)
    return {"mensaje": "Usuario actualizado correctamente"}

@router.delete("/{id}")
def eliminarUsuario(id: str, conexion: psycopg.Connection = Depends(getConexion)):
    usuarioManager.eliminarUsuario(id, conexion)
    return {"mensaje": "Usuario eliminado correctamente"}
