from fastapi import APIRouter, Depends, HTTPException
from conexion import getConexion
from backend.model.peliculaModel import PeliculaModel
from backend.manager.peliculaManager import PeliculaManager
import psycopg

router = APIRouter(prefix="/peliculas", tags=["peliculas"])

peliculaManager = PeliculaManager()


@router.get("/")
def leerPeliculas(conexion: psycopg.Connection = Depends(getConexion)):
    return peliculaManager.leerPeliculas(conexion)


@router.post("/")
def agregarPelicula(
    pelicula: PeliculaModel,
    conexion: psycopg.Connection = Depends(getConexion)
):
    try:
        peliculaManager.agregarPelicula(pelicula, conexion)
        return {"mensaje": "Película agregada correctamente"}
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.put("/{id}")
def actualizarPelicula(
    id: str,
    pelicula: PeliculaModel,
    conexion: psycopg.Connection = Depends(getConexion)
):
    peliculaManager.actualizarPelicula(id, pelicula, conexion)
    return {"mensaje": "Película actualizada correctamente"}


@router.delete("/{id}")
def eliminarPelicula(
    id: str,
    conexion: psycopg.Connection = Depends(getConexion)
):
    peliculaManager.eliminarPelicula(id, conexion)
    return {"mensaje": "Película eliminada correctamente"}