from fastapi import APIRouter, Depends
import psycopg
from conexion import getConexion
from backend.model.resenaModel import ResenaModel
from backend.manager.resenaManager import ResenaManager

router = APIRouter(prefix="/resenas", tags=["resenas"])
resenaManager = ResenaManager()

@router.get("/")
def leerResenas(conexion: psycopg.Connection = Depends(getConexion)):
    return resenaManager.leerResenas(conexion)

@router.post("/")
def agregarResena(resena: ResenaModel, conexion: psycopg.Connection = Depends(getConexion)):
    resenaManager.agregarResena(resena.id_usuario, resena.id_pelicula, resena.puntaje, resena.comentario, conexion)
    return {"mensaje": "Reseña agregada correctamente"}

@router.put("/{id}")
def actualizarResena(id: int, resena: ResenaModel, conexion: psycopg.Connection = Depends(getConexion)):
    resenaManager.actualizarResena(id, resena.puntaje, resena.comentario, conexion)
    return {"mensaje": "Reseña actualizada correctamente"}

@router.delete("/{id}")
def eliminarResena(id: int, conexion: psycopg.Connection = Depends(getConexion)):
    resenaManager.eliminarResena(id, conexion)
    return {"mensaje": "Reseña eliminada correctamente"}