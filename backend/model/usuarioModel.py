from pydantic import BaseModel

class UsuarioModel(BaseModel):
    nombre: str
    email: str
