from fastapi import APIRouter, Depends
import psycopg
from conexion import getConexion
from backend.model.usuarioModel import UsuarioModel
from backend.manager.usuarioManager import UsuarioManager

router = APIRouter(prefix="/usuario", tags=["usuario"])
usuarioManager = UsuarioManager()

@router.get("/usuarios")
def leerUsuarios(conexion: psycopg.Connection = Depends(getConexion)):
    return usuarioManager.leerUsuarios(conexion)

@router.post("/usuarios")
def agregarUsuario(usuario: UsuarioModel, conexion: psycopg.Connection = Depends(getConexion)):
    usuarioManager.agregarUsuario(usuario.nombre, usuario.email, conexion)
    return {"mensaje": "Usuario agregado correctamente"}

@router.put("/usuarios/{id}")
def actualizarUsuario(id: str, usuario: UsuarioModel, conexion: psycopg.Connection = Depends(getConexion)):
    usuarioManager.actualizarUsuario(id, usuario.nombre, usuario.email, conexion)
    return {"mensaje": "Usuario actualizado correctamente"}

@router.delete("/usuarios/{id}")
def eliminarUsuario(id: str, conexion: psycopg.Connection = Depends(getConexion)):
    usuarioManager.eliminarUsuario(id, conexion)
    return {"mensaje": "Usuario eliminado correctamente"}
