import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ImagePlus,
  LayoutTemplate,
  Tag,
  UploadCloud,
  Trash2,
} from "lucide-react";
import API from "../services/api";

function AdminDashboardPage() {
  const [form, setForm] = useState({
    title: "",
    category: "",
    type: "gallery",
    image: null,
  });
  const [albums, setAlbums] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchAlbums = async () => {
    try {
      const { data } = await API.get("/photos");
      const mainAlbums = data.filter(
        (photo) => photo.type === "gallery" && !photo.parentId
      );
      setAlbums(mainAlbums);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setForm({ ...form, image: e.target.files[0] });
      return;
    }

    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!form.image) {
      setError("Please choose an image.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("category", form.category);
      formData.append("type", form.type);
      formData.append("image", form.image);

      await API.post("/photos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Photo uploaded successfully");
      setForm({
        title: "",
        category: "",
        type: "gallery",
        image: null,
      });

      const fileInput = document.getElementById("imageInput");
      if (fileInput) fileInput.value = "";

      await fetchAlbums();
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAlbum = async (albumId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this album?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(albumId);
      setMessage("");
      setError("");

      await API.delete(`/photos/${albumId}`);

      setMessage("Album deleted successfully");
      await fetchAlbums();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete album");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="app admin-page-modern">
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

      <section className="admin-layout">
        <div className="admin-side-card">
          <p className="section-label">Dashboard</p>
          <h2>Upload content</h2>
          <p className="admin-side-text">
            Add a new album cover or gallery item for your portfolio.
          </p>

          <div className="admin-mini-list">
            <div className="admin-mini-item">
              <LayoutTemplate size={18} />
              <span>Cover or gallery</span>
            </div>
            <div className="admin-mini-item">
              <Tag size={18} />
              <span>Category based</span>
            </div>
            <div className="admin-mini-item">
              <ImagePlus size={18} />
              <span>Album-ready upload</span>
            </div>
          </div>
        </div>

        <div>
          <div className="admin-card admin-card-modern">
            <div className="admin-card-head">
              <p className="section-label">Upload Form</p>
              <h2>New photo</h2>
            </div>

            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="admin-field">
                <label>Photo title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Tshirt, Logo, Ride Album..."
                  value={form.title}
                  onChange={handleChange}
                />
              </div>

              <div className="admin-field">
                <label>Category</label>
                <input
                  type="text"
                  name="category"
                  placeholder="Motorcycle, Lifestyle, Shirt..."
                  value={form.category}
                  onChange={handleChange}
                />
              </div>

              <div className="admin-grid-2">
                <div className="admin-field">
                  <label>Type</label>
                  <select name="type" value={form.type} onChange={handleChange}>
                    <option value="gallery">Gallery</option>
                    <option value="cover">Cover</option>
                  </select>
                </div>

                <div className="admin-field">
                  <label>Image file</label>
                  <label htmlFor="imageInput" className="upload-box">
                    <UploadCloud size={18} />
                    <span>{form.image ? form.image.name : "Choose an image"}</span>
                  </label>
                  <input
                    id="imageInput"
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    hidden
                  />
                </div>
              </div>

              {message && <p className="success-text">{message}</p>}
              {error && <p className="error-text">{error}</p>}

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Uploading..." : "Upload Photo"}
              </button>
            </form>
          </div>

          <div className="admin-card admin-card-modern" style={{ marginTop: "24px" }}>
            <div className="admin-card-head">
              <p className="section-label">Albums</p>
              <h2>Uploaded albums</h2>
            </div>

            {albums.length === 0 ? (
              <p className="admin-side-text">No albums yet.</p>
            ) : (
              <div className="admin-album-grid">
                {albums.map((album) => (
                  <div className="admin-album-item" key={album.id}>
                    <Link
                      to={`/admin/dashboard/${album.id}`}
                      className="photo-card photo-card-modern"
                    >
                      <img src={album.imageUrl} alt={album.title} />
                      <div className="photo-overlay">
                        <span>{album.category}</span>
                        <h3>{album.title}</h3>
                      </div>
                    </Link>

                    <button
                      type="button"
                      className="btn delete-album-btn"
                      onClick={() => handleDeleteAlbum(album.id)}
                      disabled={deletingId === album.id}
                    >
                      <Trash2 size={16} />
                      {deletingId === album.id ? "Deleting..." : "Delete Album"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboardPage;