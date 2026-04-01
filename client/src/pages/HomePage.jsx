import { Link } from "react-router-dom";
import { Camera, Bike, Images, Shield, ArrowRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import API from "../services/api";

function HomePage() {
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [allGalleryPhotos, setAllGalleryPhotos] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const { data } = await API.get("/photos");

        const cover = data.find((photo) => photo.type === "cover");
        const gallery = data.filter(
          (photo) => photo.type === "gallery" && !photo.parentId
        );

        setCoverPhoto(cover || null);
        setAllGalleryPhotos(gallery);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPhotos();
  }, []);

  const categories = useMemo(() => {
    const dynamicCategories = [
      ...new Set(allGalleryPhotos.map((p) => p.category).filter(Boolean)),
    ];
    return ["All", ...dynamicCategories];
  }, [allGalleryPhotos]);

  const galleryPhotos = useMemo(() => {
    const filtered =
      activeCategory === "All"
        ? allGalleryPhotos
        : allGalleryPhotos.filter((photo) => photo.category === activeCategory);

    return filtered.slice(0, 6);
  }, [allGalleryPhotos, activeCategory]);

  return (
    <div className="app home-page">
      <header className="navbar">
        <div className="brand">
          <div className="brand-logo">RF</div>
          <div>
            <h1>Random Foto</h1>
            <p>Photography portfolio</p>
          </div>
        </div>

        <nav className="nav-links">
          <Link to="/gallery">Gallery</Link>
          <a href="#categories">Categories</a>
          <Link to="/admin">Admin</Link>
        </nav>
      </header>

      <section className="hero hero-modern">
        <div className="hero-text">
          <h2 className="hero-title-modern">
            Random shots,
            <br />
            street moments,
            <br />
            <span>raw photography</span>
          </h2>

          <p className="hero-subtext">
            A collection of albums, rides, and lifestyle shots.
          </p>

          <div className="hero-buttons">
            <Link to="/gallery" className="btn btn-primary">
              View Gallery
            </Link>
          </div>
        </div>

        <div className="hero-showcase">
          <div className="hero-image-frame">
            <img
              src={
                coverPhoto?.imageUrl ||
                "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80"
              }
              alt={coverPhoto?.title || "Featured cover"}
            />
          </div>

          <div className="hero-floating-card">
            <p>Featured cover</p>
            <h3>{coverPhoto?.title || "Motorcycle Frames"}</h3>
            <Link to="/gallery" className="hero-inline-link">
              Explore gallery <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="stats stats-modern">
        <div className="stat-card">
          <Camera size={20} />
          <div>
            <h3>{allGalleryPhotos.length}</h3>
            <p>Total Albums</p>
          </div>
        </div>

        <div className="stat-card">
          <Images size={20} />
          <div>
            <h3>{categories.length - 1}</h3>
            <p>Total Categories</p>
          </div>
        </div>

        <div className="stat-card">
          <Bike size={20} />
          <div>
            <h3>
              {
                allGalleryPhotos.filter((photo) =>
                  String(photo.category || "")
                    .toLowerCase()
                    .includes("motorcycle")
                ).length
              }
            </h3>
            <p>Motorcycle Albums</p>
          </div>
        </div>

        <div className="stat-card">
          <Shield size={20} />
          <div>
            <h3>{coverPhoto ? 1 : 0}</h3>
            <p>Featured Cover</p>
          </div>
        </div>
      </section>

      <section className="categories" id="categories">
        <div className="section-head">
          <p className="section-label">Categories</p>
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

      <section className="gallery-section" id="gallery">
        <div className="section-head section-head-row">
          <div>
            <p className="section-label">Gallery</p>
            <h2>Latest albums</h2>
          </div>

          <Link to="/gallery" className="section-link">
            See all <ArrowRight size={16} />
          </Link>
        </div>

        <div className="photo-grid">
          {galleryPhotos.map((photo) => (
            <Link
              to={`/gallery/${photo.id}`}
              className="photo-card photo-card-modern"
              key={photo.id}
            >
              <img src={photo.imageUrl} alt={photo.title} />
              <div className="photo-overlay">
                <span>{photo.category}</span>
                <h3>{photo.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;