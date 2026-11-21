from abc import ABC, abstractmethod

class ResenaInterface(ABC):

    @abstractmethod
    def leerResenas(self, conexion):
        pass

    @abstractmethod
    def agregarResena(self, id_usuario, id_pelicula, puntuacion, comentario, conexion):
        pass

    @abstractmethod
    def actualizarResena(self, id, puntuacion, comentario, conexion):
        pass

    @abstractmethod
    def eliminarResena(self, id, conexion):
        pass