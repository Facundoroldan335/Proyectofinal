
import psycopg
from backend.interfaces.generoInterface import GeneroInterface


class GeneroManager(GeneroInterface):

    def __init__(self):
        pass

    def leerGeneros(self, conexion: psycopg.Connection):
        res = conexion.execute("""SELECT id, created_at, nombre FROM "Genero" """).fetchall()
        return res

    def agregarGenero(self, nombre, conexion: psycopg.Connection):
        conexion.execute("""INSERT INTO "Genero" (nombre) VALUES (%s)""", (nombre,))
        conexion.commit()

    def actualizarGenero(self, id, nombre, conexion: psycopg.Connection):
        conexion.execute("""UPDATE "Genero" SET nombre = %s WHERE id = %s""", (nombre, id))
        conexion.commit()

    def eliminarGenero(self, id, conexion: psycopg.Connection):
        conexion.execute("""DELETE FROM "Genero" WHERE id = %s""", (id,))
        conexion.commit()
