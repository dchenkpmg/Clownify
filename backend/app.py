from sqlmodel import Session, select
from typing import Annotated
from fastapi import Depends, FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

from .database import create_db_and_tables, engine
from .models import Song

def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

app = FastAPI()

origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event('startup')
def on_startup():
    create_db_and_tables()

@app.post("/api/songs")
async def create_song(song: Song, session: SessionDep) -> Song:
    session.add(song)
    session.commit()
    session.refresh(song)
    return song

@app.get("/api/songs")
async def read_songs(session: SessionDep, offset: int = 0, limit: Annotated[int,  Query(le=10)] = 3):
    songs = session.exec(select(Song).offset(offset).limit(limit)).all()
    return songs
    
@app.patch("/api/songs/{song_id}")
async def update_song(song_id: int, song: Song, session: SessionDep) -> Song:
    return {"response": "ok"}

@app.delete("/api/songs/{song_id}")
async def delete_song(session: SessionDep, song_id: int):
    return {"response": "ok"}









