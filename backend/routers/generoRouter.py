from fastapi import APIRouter, Depends
import psycopg
from conexion import getConexion
from backend.model.generoModel import GeneroModel
from backend.manager.generoManager import GeneroManager

router = APIRouter(prefix="/genero", tags=["generos"])
generoManager = GeneroManager()

@router.get("/")
def leerGeneros(conexion: psycopg.Connection = Depends(getConexion)):
    return generoManager.leerGeneros(conexion)

@router.post("/generos")
def agregarGenero(genero: GeneroModel, conexion: psycopg.Connection = Depends(getConexion)):
    generoManager.agregarGenero(genero.nombre, conexion)
    return {"mensaje": "Género agregado correctamente"}

@router.put("/generos/{id}")
def actualizarGenero(id: str, genero: GeneroModel, conexion: psycopg.Connection = Depends(getConexion)):
    generoManager.actualizarGenero(id, genero.nombre, conexion)
    return {"mensaje": "Género actualizado correctamente"}

@router.delete("/generos/{id}")
def eliminarGenero(id: str, conexion: psycopg.Connection = Depends(getConexion)):
    generoManager.eliminarGenero(id, conexion)
    return {"mensaje": "Género eliminado correctamente"}