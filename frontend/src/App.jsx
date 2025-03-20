import { useState } from "react";
import Icon from "@mdi/react";
import { mdiGithub } from "@mdi/js";
import SongForm from "./components/SongForm";
import "./App.css";

function App() {
  // replace with results from fetching songs from db
  const initialSongs = [
    {
      title: "Thanks fr th Mmrs",
      album: "Infinity on High",
      artist: "Fall Out Boy",
    },
    {
      title: "Pain",
      album: "Futures",
      artist: "Jimmy Eat World",
    },
  ];
  const [songs, setSongs] = useState(initialSongs);

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
          <input type="text" name="q" placeholder="Search title..."></input>
          <p>Placeholder Text</p>
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
