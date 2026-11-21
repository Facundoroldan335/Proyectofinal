import psycopg
from backend.model.peliculaModel import PeliculaModel
from backend.interfaces.peliculaInterface import PeliculaInterface


class PeliculaManager(PeliculaInterface):

    def __init__(self):
        pass

    def leerPeliculas(self, conexion: psycopg.Connection):
        res = conexion.execute("""
            SELECT id, titulo, anio, portada, director, sinopsis
            FROM "Pelicula"
        """).fetchall()

        return res

    def agregarPelicula(self, pelicula: PeliculaModel, conexion: psycopg.Connection):
        conexion.execute("""
            INSERT INTO "Pelicula" (titulo, anio, portada, director, sinopsis)
            VALUES (%s, %s, %s, %s, %s)
        """, (
            pelicula.titulo,
            pelicula.anio,
            pelicula.portada,
            pelicula.director,
            pelicula.sinopsis
        ))

        conexion.commit()

    def actualizarPelicula(self, id: int, pelicula: PeliculaModel, conexion: psycopg.Connection):
        conexion.execute("""
            UPDATE "Pelicula"
            SET titulo = %s, anio = %s, portada = %s,
                director = %s, sinopsis = %s
            WHERE id = %s
        """, (
            pelicula.titulo,
            pelicula.anio,
            pelicula.portada,
            pelicula.director,
            pelicula.sinopsis,
            id
        ))

        conexion.commit()

    def eliminarPelicula(self, id: int, conexion: psycopg.Connection):
        conexion.execute("""
            DELETE FROM "Pelicula"
            WHERE id = %s
        """, (id,))

        conexion.commit()
