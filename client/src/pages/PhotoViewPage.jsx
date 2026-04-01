import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Download, Image as ImageIcon } from "lucide-react";
import API from "../services/api";

function PhotoViewPage() {
  const { id } = useParams();
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const { data } = await API.get("/photos");
        const foundPhoto = data.find((item) => String(item.id) === String(id));
        setPhoto(foundPhoto || null);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPhoto();
  }, [id]);

  if (!photo) {
    return (
      <div className="app">
        <div className="photo-view-empty">Photo not found</div>
      </div>
    );
  }

  return (
    <div className="app photo-view-page">
      <header className="navbar">
        <div className="brand">
          <div className="brand-logo">RF</div>
          <div>
            <h1>Random Foto</h1>
            <p>Photo view</p>
          </div>
        </div>

        <nav className="nav-links">
          <Link to="/gallery" className="back-link">
            <ArrowLeft size={18} />
            Back
          </Link>
        </nav>
      </header>

      <section className="photo-view-hero">
        <div className="photo-view-top">
          <div>
            <p className="section-label">{photo.category || "Gallery"}</p>
            <h2 className="photo-view-title">{photo.title}</h2>
          </div>

          <a
            href={`http://localhost:5000/download/${photo.imageUrl.split("/").pop()}`}
            className="btn btn-primary photo-download-btn"
          >
            <Download size={18} />
            Download
          </a>
        </div>

        <div className="photo-view-shell">
          <div className="photo-view-image-wrap">
            <img
              src={photo.imageUrl}
              alt={photo.title}
              className="photo-view-image"
            />
          </div>

          <div className="photo-view-info">
            <div className="photo-info-card">
              <div className="photo-info-icon">
                <ImageIcon size={18} />
              </div>
              <div>
                <p>Title</p>
                <h3>{photo.title}</h3>
              </div>
            </div>

            <div className="photo-info-card">
              <div className="photo-info-icon">
                <ImageIcon size={18} />
              </div>
              <div>
                <p>Category</p>
                <h3>{photo.category || "Uncategorized"}</h3>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PhotoViewPage;