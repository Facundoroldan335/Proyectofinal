from fastapi import APIRouter, Depends, HTTPException
from conexion import getConexion
from backend.model.peliculaModel import PeliculaModel
from backend.manager.peliculaManager import PeliculaManager

import psycopg

router = APIRouter(prefix="/peliculas", tags=["peliculas"])

peliculaManager = PeliculaManager()

@router.get("/peliculas")
def leerPeliculas(conexion: psycopg.Connection = Depends(getConexion)):
    return peliculaManager.leerPeliculas(conexion)

@router.post("/peliculas")
def agregarPelicula(pelicula:PeliculaModel, conexion: psycopg.Connection = Depends(getConexion)):
    peliculaManager.agregarPelicula(pelicula, conexion)
    return{"mensaje": "Pelicula agregada correctamente"}

@router.put("/peliculas{id}")
def actualizarPeliculas(id:int, pelicula:PeliculaModel, conexion: psycopg.Connection = Depends(getConexion)):
    resultado = peliculaManager.actualizarPelicula(id, pelicula, conexion)
    if resultado == 0:
        raise HTTPException(status_code=404, detail="Pelicula no encontrada")
    return{"mensaje": "Pelicula actualizada correctamente"}

@router.delete("/peliculas{id}")
def eliminarPelicula(id: int, pelicula:PeliculaModel, conexion: psycopg.Connection = Depends(getConexion)):
    resultado = peliculaManager.eliminarPelicula(id, pelicula, conexion)
    if resultado == 0:
        raise HTTPException(status_code=404, detail="Pelicula no encontrada")
    return{"mensaje": "Pelicula eliminada correctamente"}