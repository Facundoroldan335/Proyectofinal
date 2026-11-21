from pydantic import BaseModel
from typing import Optional


class ResenaModel(BaseModel):
    id_usuario: str
    id_pelicula: str
    puntaje: Optional[int] = None
    comentario: Optional[str] = None