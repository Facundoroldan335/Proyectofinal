from abc import ABC, abstractmethod


class PeliculaInterface(ABC):

    @abstractmethod
    def leerPeliculas(self):
        pass

    @abstractmethod
    def agregarPelicula(self, pelicula):
        pass

    @abstractmethod
    def actualizarPelicula(self, id, pelicula):
        pass

    @abstractmethod
    def eliminarPelicula(self, id):
        pass