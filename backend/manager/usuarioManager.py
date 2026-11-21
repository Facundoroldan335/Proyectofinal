import psycopg
from backend.interfaces.usuarioInterface import UsuarioInterface

class UsuarioManager(UsuarioInterface):

    def __init__(self):
        pass

    def leerUsuarios(self, conexion: psycopg.Connection):
        res = conexion.execute("""SELECT id, created_at, nombre, email FROM "Usuario" """).fetchall()
        return res

    def agregarUsuario(self, nombre, email, conexion: psycopg.Connection):
        conexion.execute("""INSERT INTO "Usuario" (nombre, email) VALUES (%s, %s)""", (nombre, email))
        conexion.commit()

    def actualizarUsuario(self, id, nombre, email, conexion: psycopg.Connection):
        conexion.execute("""UPDATE "Usuario" SET nombre = %s, email = %s WHERE id = %s""", (nombre, email, id))
        conexion.commit()

    def eliminarUsuario(self, id, conexion: psycopg.Connection):
        conexion.execute(""" DELETE FROM "Usuario" WHERE id = %s """, (id,))
        conexion.commit()
