import { useEffect, useState } from "react";
import Icon from "@mdi/react";
import { mdiGithub } from "@mdi/js";
import SongForm from "./components/SongForm";
import SongList from "./components/SongList";
import "./App.css";

function App() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // const [update, setUpdate] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreSongs, setHasMoreSongs] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const limit = 2;
    setLoading(true);
    const fetchSongs = async () => {
      try {
        const offset = (page - 1) * limit;
        const response = await fetch(
          `http://127.0.0.1:8000/api/songs?offset=${offset}&limit=${limit}`
        );
        if (!response.ok) {
          throw new Error(`HTTP request error: ${response.status}`);
        }
        const songData = await response.json();
        setHasMoreSongs(songData.length > 0);
        setSongs([...songData]);
        console.log("Songs retrieved successfully: ", songData);
      } catch (error) {
        console.error("Caught error: ", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, [page]);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredSongs = songs.filter((song) =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (hasMoreSongs) {
      setPage(page + 1);
    }
  };

  return (
    <>
      <header className="app-header">
        <h1>My Songs</h1>
      </header>
      <main>
        <div className="form-section">
          <SongForm songs={songs} setSongs={setSongs}></SongForm>
        </div>
        <div className="list-section">
          <input
            type="text"
            name="q"
            placeholder="Search title..."
            onChange={handleSearch}
          ></input>
          {loading && <p>Song list is loadng...</p>}
          {error && <p>Error loading song list</p>}
          {filteredSongs.length > 0 ? (
            <SongList songs={filteredSongs}></SongList>
          ) : (
            <p>No songs left</p>
          )}
          <div className="pagination-section">
            <button onClick={handlePrevPage} disabled={page === 1}>
              Previous
            </button>
            <button onClick={handleNextPage} disabled={!hasMoreSongs}>
              Next
            </button>
          </div>
        </div>
      </main>
      <footer>
        <a
          href="https://github.com/dchenkpmg/Clownify"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon path={mdiGithub} size={1.5}></Icon>
        </a>
      </footer>
    </>
  );
}

export default App;
