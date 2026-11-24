from pydantic import BaseModel, Field
from typing import Optional

class PeliculaModel(BaseModel):
    titulo: str
    anio: int
    portada: str
    director: Optional[str] = None
    sinopsis: Optional[str] = None
    generos: list[str] = Field(default_factory=list)