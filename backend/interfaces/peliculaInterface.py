from abc import ABC, abstractmethod

class PeliculaInterface(ABC):

    @abstractmethod
    def leerPeliculas(self, conexion):
        pass

    @abstractmethod
    def agregarPelicula(self, pelicula, conexion):
        pass

    @abstractmethod
    def actualizarPelicula(self, id, pelicula, conexion):
        pass

    @abstractmethod
    def eliminarPelicula(self, id, conexion):
        pass
