import psycopg
from backend.interfaces.resenaInterface import ResenaInterface

class ResenaManager(ResenaInterface):

    def __init__(self):
        pass

    def leerResenas(self, conexion: psycopg.Connection):
        res = conexion.execute(""" SELECT id, created_at, id_pelicula, id_usuario, puntaje, comentario FROM resena""").fetchall()
        return res

    def agregarResena(self, id_usuario, id_pelicula, puntaje, comentario, conexion: psycopg.Connection):
        conexion.execute("""INSERT INTO resena (id_usuario, id_pelicula, puntaje, comentario) VALUES (%s, %s, %s, %s)""", (id_usuario, id_pelicula, puntaje, comentario))
        conexion.commit()

    def actualizarResena(self, id, puntaje, comentario, conexion: psycopg.Connection):
        conexion.execute("""UPDATE resena SET puntaje = %s, comentario = %s WHERE id = %s""", (puntaje, comentario, id))
        conexion.commit()

    def eliminarResena(self, id, conexion: psycopg.Connection):
        conexion.execute("""DELETE FROM resena WHERE id = %s""", (id,))
        conexion.commit()