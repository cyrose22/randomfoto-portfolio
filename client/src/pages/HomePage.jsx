import { Link } from "react-router-dom";
import { Camera, Bike, Images, Shield } from "lucide-react";

const samplePhotos = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1517846693594-1567da72af75?auto=format&fit=crop&w=900&q=80",
    title: "Street Motion",
    category: "Motorcycle",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    title: "Golden Ride",
    category: "Random Foto",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1494253109108-2e30c049369b?auto=format&fit=crop&w=900&q=80",
    title: "Urban Speed",
    category: "Motorcycle",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80",
    title: "Festival Frame",
    category: "Random Foto",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=900&q=80",
    title: "Fast Lane",
    category: "Motorcycle",
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1504203700686-0f59d18b89f9?auto=format&fit=crop&w=900&q=80",
    title: "Night Story",
    category: "Random Foto",
  },
];

function HomePage() {
  return (
    <div className="app">
      <header className="navbar">
        <div className="brand">
          <div className="brand-logo">RF</div>
          <div>
            <h1>Random Foto</h1>
            <p>Modern photography portfolio</p>
          </div>
        </div>

        <nav className="nav-links">
          <Link to="/gallery">Gallery</Link>
          <a href="#categories">Categories</a>
          <Link to="/admin">Admin</Link>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-text">
          <span className="badge">Photography Portfolio</span>
          <h2>
            Random shots, street moments, and mostly
            <span> motorcycle photography</span>
          </h2>
          <p>
            Showcase your best captures in a clean, dark, modern portfolio.
            Perfect for your Random Foto brand.
          </p>

          <div className="hero-buttons">
            <Link to="/gallery" className="btn btn-primary">
              View Gallery
            </Link>
            <Link to="/admin" className="btn btn-secondary">
              Admin Upload
            </Link>
          </div>
        </div>

        <div className="hero-card">
          <img
            src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80"
            alt="Motorcycle photography"
          />
          <div className="hero-card-overlay">
            <p>Featured Theme</p>
            <h3>Motorcycle Frames</h3>
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="stat-card">
          <Camera size={20} />
          <div>
            <h3>Creative Shots</h3>
            <p>Portfolio-ready display</p>
          </div>
        </div>
        <div className="stat-card">
          <Bike size={20} />
          <div>
            <h3>Motorcycle Focus</h3>
            <p>Your signature category</p>
          </div>
        </div>
        <div className="stat-card">
          <Images size={20} />
          <div>
            <h3>Modern Gallery</h3>
            <p>Clean grid layout</p>
          </div>
        </div>
        <div className="stat-card">
          <Shield size={20} />
          <div>
            <h3>Admin Upload</h3>
            <p>Private upload dashboard</p>
          </div>
        </div>
      </section>

      <section className="categories" id="categories">
        <div className="section-head">
          <p className="section-label">Categories</p>
          <h2>Your style</h2>
        </div>

        <div className="category-pills">
          <button className="pill active">All</button>
          <button className="pill">Motorcycle</button>
          <button className="pill">Street</button>
          <button className="pill">Events</button>
          <button className="pill">Random Foto</button>
        </div>
      </section>

      <section className="gallery-section" id="gallery">
        <div className="section-head">
          <p className="section-label">Gallery</p>
          <h2>Latest photos</h2>
        </div>

        <div className="photo-grid">
          {samplePhotos.map((photo) => (
            <div className="photo-card" key={photo.id}>
              <img src={photo.image} alt={photo.title} />
              <div className="photo-overlay">
                <span>{photo.category}</span>
                <h3>{photo.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;