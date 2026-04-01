import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Images, ArrowRight } from "lucide-react";
import API from "../services/api";

function GalleryPage() {
  const [photos, setPhotos] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const { data } = await API.get("/photos");

        const galleryPhotos = data.filter(
          (photo) => photo.type === "gallery" && !photo.parentId
        );

        setPhotos(galleryPhotos);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPhotos();
  }, []);

  const categories = useMemo(() => {
    const dynamicCategories = [...new Set(photos.map((p) => p.category).filter(Boolean))];
    return ["All", ...dynamicCategories];
  }, [photos]);

  const filteredPhotos =
    activeCategory === "All"
      ? photos
      : photos.filter((photo) => photo.category === activeCategory);

  return (
    <div className="app gallery-page-modern">
      <header className="navbar">
        <div className="brand">
          <div className="brand-logo">RF</div>
          <div>
            <h1>Random Foto</h1>
            <p>Gallery collection</p>
          </div>
        </div>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/admin">Admin</Link>
        </nav>
      </header>

      <section className="gallery-hero">
        <div className="gallery-hero-text">
          <span className="badge">Portfolio Gallery</span>
          <h2>Browse albums and featured collections</h2>
          <p>
            Explore organized albums, ride shots, lifestyle captures, and curated RandomFoto highlights.
          </p>
        </div>

        <div className="gallery-hero-card">
          <div className="gallery-hero-icon">
            <Images size={22} />
          </div>
          <h3>{filteredPhotos.length}</h3>
          <p>{activeCategory === "All" ? "Albums available" : `${activeCategory} albums`}</p>
        </div>
      </section>

      <section className="categories">
        <div className="section-head section-head-row">
          <div>
            <p className="section-label">Portfolio</p>
            <h2>All Photos</h2>
          </div>
        </div>

        <div className="category-pills">
          {categories.map((category) => (
            <button
              key={category}
              className={`pill ${activeCategory === category ? "active" : ""}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <div className="photo-grid photo-grid-modern">
        {filteredPhotos.map((photo) => (
          <Link
            to={`/gallery/${photo.id}`}
            className="photo-card photo-card-modern"
            key={photo.id}
          >
            <img src={photo.imageUrl} alt={photo.title} />
            <div className="photo-overlay">
              <span>{photo.category}</span>
              <h3>{photo.title}</h3>
              <div className="album-link-inline">
                Open album <ArrowRight size={15} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default GalleryPage;