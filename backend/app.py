from sqlmodel import Session, select
from typing import Annotated
from fastapi import Depends, FastAPI, Query, HTTPException
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
    song_db = session.get(Song, song_id)
    if not song_db:
        raise HTTPException(status_code=404, detail="Song not found")
    song_data = song.model_dump(exclude_unset=True)
    song_db.sqlmodel_update(song_data)
    session.add(song_db)
    session.commit()
    session.refresh(song_db)
    return song_db


# @app.patch("/api/songs/{song_id}")
# def update_hero(hero_id: int, hero: HeroUpdate, session: SessionDep):
#     hero_db = session.get(Hero, hero_id)
#     if not hero_db:
#         raise HTTPException(status_code=404, detail="Hero not found")
#     hero_data = hero.model_dump(exclude_unset=True)
#     hero_db.sqlmodel_update(hero_data)
#     session.add(hero_db)
#     session.commit()
#     session.refresh(hero_db)
#     return hero_db

@app.delete("/api/songs/{song_id}")
async def delete_song(session: SessionDep, song_id: int):
    song = session.get(Song, song_id)
    if not song:
        raise HTTPException(status_code=404, detail="Hero not found")
    session.delete(song)
    session.commit()
    return {"ok": True}









