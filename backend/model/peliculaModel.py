from pydantic import BaseModel

class PeliculaModel(BaseModel):
    titulo: str
    anio: int
    portada: str
    director: str
    sinopsis: str
