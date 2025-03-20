from sqlmodel import Field, SQLModel

class Song(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str | None = None
    album: str | None = None
    artist: str | None = None

