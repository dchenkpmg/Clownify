import React, { useState } from "react";
import "../styles/SongList.css";

export default function SongList({ songs, setSongs }) {
  const [error, setError] = useState(null);
  const [editSongId, setEditSongId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleEditClick = (song) => {
    setEditSongId(song.id);
    setEditFormData(song);
  };

  const handleUpdate = async (e, id) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/songs/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editFormData),
      });
      if (!response.ok) {
        throw new Error(`HTTP request error: ${response.status}`);
      }
      const songData = await response.json();
      setSongs(songs.map((song) => (song.id === id ? songData : song)));
      setEditSongId(null);
      console.log(`Song with id ${id} updated successfully`);
    } catch (error) {
      console.error("Caught error: ", error);
      setError(true);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/songs/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP request error: ${response.status}`);
      }

      setSongs(songs.filter((song) => song.id !== id));
      console.log(`Song with id ${id} deleted successfully`);
    } catch (error) {
      console.error("Caught error: ", error);
      setError(true);
    }
  };

  return (
    <>
      {songs.map((song) => (
        <div className="song-item" key={song.id}>
          {editSongId === song.id ? (
            <form onSubmit={(e) => handleUpdate(e, song.id)}>
              <input
                name="title"
                type="text"
                value={editFormData.title || ""}
                onChange={handleEditChange}
              />
              <input
                name="album"
                type="text"
                value={editFormData.album || ""}
                onChange={handleEditChange}
              />
              <input
                name="artist"
                type="text"
                value={editFormData.artist || ""}
                onChange={handleEditChange}
              />
              <button type="submit">Save</button>
              <button type="button" onClick={() => setEditSongId(null)}>
                Cancel
              </button>
            </form>
          ) : (
            <>
              <p>{song.title}</p>
              <p>{song.album}</p>
              <p>{song.artist}</p>
              <button onClick={() => handleEditClick(song)}>Edit</button>
              <button onClick={() => handleDelete(song.id)}>Delete</button>
            </>
          )}
          {error && <p>Error deleting song</p>}
        </div>
      ))}
    </>
  );
}
