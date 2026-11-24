from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers.peliculaRouter import router as peliculaRouter
from backend.routers.usuarioRouter import router as usuarioRouter
from backend.routers.generoRouter import router as generoRouter
from backend.routers.resenaRouter import router as resenaRouter

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
app.include_router(peliculaRouter)
app.include_router(usuarioRouter)
app.include_router(generoRouter)
app.include_router(resenaRouter)