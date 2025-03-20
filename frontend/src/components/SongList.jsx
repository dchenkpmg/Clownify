import React, { useState } from "react";
import "../styles/SongList.css";

export default function SongList({ songs }) {
  const [update, setUpdate] = useState(false);
  const updateHandler = (id) => {};
  const deleteHandler = (id) => {};
  return (
    <>
      {songs.map((song) => (
        <div className="song-item" key={song.id}>
          <p>{song.title}</p>
          <p>{song.album}</p>
          <p>{song.artist}</p>
          <button onClick={() => updateHandler(song.id)}>Edit</button>
          <button onClick={() => deleteHandler(song.id)}>Delete</button>
        </div>
      ))}
    </>
  );
}
