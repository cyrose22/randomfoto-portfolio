import { Link } from "react-router-dom";

function AdminDashboardPage() {
  return (
    <div className="app admin-page">
      <header className="navbar">
        <div className="brand">
          <div className="brand-logo">RF</div>
          <div>
            <h1>Random Foto</h1>
            <p>Admin dashboard</p>
          </div>
        </div>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/gallery">Gallery</Link>
        </nav>
      </header>

      <div className="admin-card">
        <p className="section-label">Dashboard</p>
        <h2>Upload new photo</h2>

        <form className="admin-form">
          <input type="text" placeholder="Photo title" />
          <input type="text" placeholder="Category: motorcycle / event / random" />
          <input type="file" />
          <button type="submit" className="btn btn-primary">
            Upload Photo
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminDashboardPage;