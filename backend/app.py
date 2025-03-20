from sqlmodel import Session
from typing import Annotated
from fastapi import Depends, FastAPI

from .database import create_db_and_tables, engine
from .models import Song

def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

app = FastAPI()

@app.on_event('startup')
def on_startup():
    create_db_and_tables()







