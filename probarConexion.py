from conexion import getConexion

generador = getConexion()
conexion = next(generador)

try:
    resultado = conexion.execute("SELECT 1").fetchone()
    print("Conexión exitosa:", resultado)
finally:
    generador.close()