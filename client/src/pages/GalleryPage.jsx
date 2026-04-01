import { Link } from "react-router-dom";

const photos = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80",
    title: "Road King",
    category: "Motorcycle",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    title: "Street Light",
    category: "Random Foto",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80",
    title: "Festival Shot",
    category: "Event",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1494253109108-2e30c049369b?auto=format&fit=crop&w=1200&q=80",
    title: "Urban Ride",
    category: "Motorcycle",
  },
];

function GalleryPage() {
  return (
    <div className="app">
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

      <section className="section-head">
        <p className="section-label">Portfolio</p>
        <h2>All Photos</h2>
      </section>

      <div className="photo-grid">
        {photos.map((photo) => (
          <div className="photo-card" key={photo.id}>
            <img src={photo.image} alt={photo.title} />
            <div className="photo-overlay">
              <span>{photo.category}</span>
              <h3>{photo.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GalleryPage;