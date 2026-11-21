from abc import ABC, abstractmethod

class UsuarioInterface(ABC):

    @abstractmethod
    def leerUsuarios(self, conexion):
        pass

    @abstractmethod
    def agregarUsuario(self, nombre, email, conexion):
        pass

    @abstractmethod
    def actualizarUsuario(self, id, nombre, email, conexion):
        pass

    @abstractmethod
    def eliminarUsuario(self, id, conexion):
        pass 