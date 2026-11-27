import psycopg
from backend.model.peliculaModel import PeliculaModel
from backend.interfaces.peliculaInterface import PeliculaInterface

class PeliculaManager(PeliculaInterface):
    def __init__(self):
        pass

    def leerPeliculas(self, conexion: psycopg.Connection):
        peliculas = conexion.execute("""
            SELECT id, titulo, anio, portada, director, sinopsis
            FROM "Pelicula"
        """).fetchall()
        resultado = []
        for pelicula in peliculas:
            generos = conexion.execute(""" SELECT g.id, g.nombre FROM "Genero" g INNER JOIN "pelicula_genero" pg ON g.id = pg.id_genero WHERE pg.id_pelicula = %s""", (pelicula["id"],)).fetchall()
            pelicula = dict(pelicula)
            pelicula["generos"] = generos
            resultado.append(pelicula)
        return resultado

    def agregarPelicula(self, pelicula: PeliculaModel, conexion: psycopg.Connection):
        try:
            nuevaPelicula = conexion.execute(""" INSERT INTO "Pelicula" (titulo, anio, portada, director, sinopsis) VALUES (%s, %s, %s, %s, %s) RETURNING id """, (
                pelicula.titulo,
                pelicula.anio,
                pelicula.portada,
                pelicula.director,
                pelicula.sinopsis
            )).fetchone()

            id_pelicula = nuevaPelicula["id"]
            for id_genero in pelicula.generos:
                conexion.execute("""INSERT INTO "pelicula_genero" (id_pelicula, id_genero) VALUES (%s, %s)""", (id_pelicula, id_genero))
            conexion.commit()
            return id_pelicula
        except Exception:
            conexion.rollback()
            raise

    def actualizarPelicula(self, id: str, pelicula: PeliculaModel, conexion: psycopg.Connection):
        try:
            resultado = conexion.execute("""UPDATE "Pelicula" SET titulo = %s, anio = %s, portada = %s, director = %s, sinopsis = %s WHERE id = %s""", (
                pelicula.titulo,
                pelicula.anio,
                pelicula.portada,
                pelicula.director,
                pelicula.sinopsis,
                id
            ))
            if resultado.rowcount == 0:
                conexion.rollback()
                return False
            conexion.execute("""DELETE FROM "pelicula_genero" WHERE id_pelicula = %s""", (id,))
            for id_genero in pelicula.generos:
                conexion.execute(""" INSERT INTO "pelicula_genero" (id_pelicula, id_genero) VALUES (%s, %s)""", (id, id_genero))
            conexion.commit()
            return True
        except Exception:
            conexion.rollback()
            raise
    def eliminarPelicula(self, id: str, conexion: psycopg.Connection):
        try:
            conexion.execute(""" DELETE FROM "pelicula_genero" WHERE id_pelicula = %s""", (id,))
            resultado = conexion.execute(""" DELETE FROM "Pelicula" WHERE id = %s""", (id,))
            if resultado.rowcount == 0:
                conexion.rollback()
                return False
            conexion.commit()
            return True
        except Exception:
            conexion.rollback()
            raise
