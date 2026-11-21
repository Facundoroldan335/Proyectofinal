from abc import ABC, abstractmethod

class GeneroInterface(ABC):

    @abstractmethod
    def leerGeneros(self, conexion):
        pass

    @abstractmethod
    def agregarGenero(self, nombre, conexion):
        pass

    @abstractmethod
    def actualizarGenero(self, id, nombre, conexion):
        pass

    @abstractmethod
    def eliminarGenero(self, id, conexion):
        pass
