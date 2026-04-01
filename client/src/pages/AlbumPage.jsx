import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

function AlbumPage() {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const { data } = await API.get("/photos");

        const mainAlbum = data.find((photo) => String(photo.id) === String(id));
        const albumPhotos = data.filter(
          (photo) => String(photo.parentId) === String(id)
        );

        setAlbum(mainAlbum || null);
        setPhotos(albumPhotos);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAlbum();
  }, [id]);

  return (
    <div className="app">
      <header className="navbar">
        <div className="brand">
          <div className="brand-logo">RF</div>
          <div>
            <h1>Random Foto</h1>
            <p>Album view</p>
          </div>
        </div>

        <nav className="nav-links">
          <Link to="/gallery">Back</Link>
          <Link to="/admin">Admin</Link>
        </nav>
      </header>

      <section className="section-head">
        <p className="section-label">Album</p>
        <h2>{album?.title || "Album Photos"}</h2>
      </section>

      {album && (
        <div
          className="photo-card"
          style={{
            marginBottom: "24px",
            maxWidth: "720px",
            minHeight: "auto"
          }}
        >
          <img
            src={album.imageUrl}
            alt={album.title}
            style={{ width: "100%", height: "420px", objectFit: "cover" }}
          />
          <div className="photo-overlay">
            <span>{album.category}</span>
            <h3>{album.title}</h3>
          </div>
        </div>
      )}

        <div className="photo-grid">
            {photos.map((photo) => (
                <Link to={`/photo/${photo.id}`} className="photo-card" key={photo.id}>
                <img src={photo.imageUrl} alt={photo.title} />
                <div className="photo-overlay">
                    <span>{photo.category}</span>
                    <h3>{photo.title}</h3>
                </div>
                </Link>
            ))}
        </div>
    </div>
  );
}

export default AlbumPage;