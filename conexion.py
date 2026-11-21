import psycopg
import os
from urllib.parse import quote
from psycopg.rows import dict_row
from dotenv import load_dotenv

load_dotenv(".env/.env")

PASSWORD = os.getenv("SUPABASE_PASSWORD")
PASSWORD = quote(PASSWORD, safe="")

DATABASE_URL = f"postgresql://postgres.cndxmjthhzwlkgabbrts:{PASSWORD}@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

def getConexion():
    conexion = psycopg.connect(DATABASE_URL, row_factory=dict_row)

    try:
        yield conexion
    finally:
        conexion.close()
