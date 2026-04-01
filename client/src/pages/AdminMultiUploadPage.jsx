import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { UploadCloud, Images, ArrowRight } from "lucide-react";
import API from "../services/api";

function AdminMultiUploadPage() {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [albumPhotos, setAlbumPhotos] = useState([]);
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAlbumData = async () => {
    try {
      const { data } = await API.get("/photos");

      const foundAlbum = data.find((item) => String(item.id) === String(id));
      const relatedPhotos = data.filter(
        (item) => String(item.parentId) === String(id)
      );

      setAlbum(foundAlbum || null);
      setAlbumPhotos(relatedPhotos);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAlbumData();
  }, [id]);

  const handleChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    if (!files.length) return;

    const formData = new FormData();

    files.forEach((file) => {
      formData.append("images", file);
    });

    try {
      setLoading(true);

      await API.post(`/photos/multi/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(`${files.length} files uploaded`);
      setFiles([]);

      const fileInput = document.getElementById("multiImages");
      if (fileInput) fileInput.value = "";

      await fetchAlbumData();
    } catch (error) {
      setMessage("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app admin-page-modern">
      <header className="navbar">
        <div className="brand">
          <div className="brand-logo">RF</div>
          <div>
            <h1>Random Foto</h1>
            <p>Multi upload</p>
          </div>
        </div>

        <nav className="nav-links">
          <Link to="/admin/dashboard">Back</Link>
          <Link to="/gallery">Gallery</Link>
        </nav>
      </header>

      <section className="admin-layout">
        <div className="admin-side-card">
          <p className="section-label">Album</p>
          <h2>{album?.title || "Album"}</h2>
          <p className="admin-side-text">
            Upload multiple images connected to this album.
          </p>

          <div className="admin-mini-list">
            <div className="admin-mini-item">
              <Images size={18} />
              <span>{albumPhotos.length} album photos</span>
            </div>
            <div className="admin-mini-item">
              <UploadCloud size={18} />
              <span>Multi image upload</span>
            </div>
          </div>
        </div>

        <div>
          {album && (
            <div className="admin-card admin-card-modern" style={{ marginBottom: "24px" }}>
              <div className="admin-card-head">
                <p className="section-label">Selected Album</p>
                <h2>{album.title}</h2>
              </div>

              <div
                className="photo-card"
                style={{
                  maxWidth: "540px",
                  minHeight: "auto",
                }}
              >
                <img
                  src={album.imageUrl}
                  alt={album.title}
                  style={{ width: "100%", height: "320px", objectFit: "cover" }}
                />
                <div className="photo-overlay">
                  <span>{album.category}</span>
                  <h3>{album.title}</h3>
                </div>
              </div>
            </div>
          )}

          <div className="admin-card admin-card-modern">
            <div className="admin-card-head">
              <p className="section-label">Upload Form</p>
              <h2>Upload multiple photos</h2>
            </div>

            <div className="admin-form">
              <div className="admin-field">
                <label htmlFor="multiImages">Choose images</label>
                <label htmlFor="multiImages" className="upload-box">
                  <UploadCloud size={18} />
                  <span>
                    {files.length ? `${files.length} files selected` : "Choose multiple images"}
                  </span>
                </label>
                <input
                  id="multiImages"
                  type="file"
                  name="images"
                  multiple
                  accept="image/*"
                  onChange={handleChange}
                  hidden
                />
              </div>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleUpload}
                disabled={loading}
              >
                {loading ? "Uploading..." : "Upload All"}
              </button>

              {message && <p className="success-text">{message}</p>}
            </div>

            {files.length > 0 && (
              <div className="photo-grid" style={{ marginTop: "24px" }}>
                {files.map((file, index) => (
                  <div className="photo-card" key={index}>
                    <img src={URL.createObjectURL(file)} alt={file.name} />
                    <div className="photo-overlay">
                      <span>Preview</span>
                      <h3>{file.name}</h3>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="admin-card admin-card-modern" style={{ marginTop: "24px" }}>
            <div className="admin-card-head section-head-row">
              <div>
                <p className="section-label">Album Photos</p>
                <h2>Uploaded images</h2>
              </div>

              {albumPhotos.length > 0 && (
                <Link to={`/gallery/${id}`} className="section-link">
                  View album <ArrowRight size={16} />
                </Link>
              )}
            </div>

            {albumPhotos.length === 0 ? (
              <p className="admin-side-text">No images uploaded to this album yet.</p>
            ) : (
              <div className="photo-grid">
                {albumPhotos.map((photo) => (
                  <Link
                    to={`/photo/${photo.id}`}
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
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminMultiUploadPage;