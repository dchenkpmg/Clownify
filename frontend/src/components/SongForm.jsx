import { useState } from "react";
import "../styles/SongForm.css";

export default function SongForm({ songs, setSongs }) {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(null);
  const [responseMessage, setResponseMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/songs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const songData = await response.json();
      setSongs([...songs, songData]);
      setResponseMessage("Song added successfully!");
      console.log("Song added successfully:", songData);
    } catch (error) {
      setResponseMessage("Error adding song");
      console.error("Error adding song:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <>
      <form className="song-form" onSubmit={handleSubmit}>
        <label htmlFor="title">Title: </label>
        <input
          name="title"
          id="title"
          type="text"
          onChange={handleChange}
        ></input>
        <label htmlFor="album">Album: </label>
        <input
          name="album"
          id="album"
          type="text"
          onChange={handleChange}
        ></input>
        <label htmlFor="artist">Artist: </label>
        <input
          name="artist"
          id="artist"
          type="text"
          onChange={handleChange}
        ></input>
        <button type="submit">Submit</button>
      </form>
      {isLoading && <p>Uploading song...</p>}
      {responseMessage && <p>{responseMessage}</p>}
    </>
  );
}
