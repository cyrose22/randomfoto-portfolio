import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function AdminLoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.username && form.password) {
      navigate("/admin/dashboard");
    }
  };

  return (
    <div className="app admin-page">
      <header className="navbar">
        <div className="brand">
          <div className="brand-logo">RF</div>
          <div>
            <h1>Random Foto</h1>
            <p>Admin login</p>
          </div>
        </div>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/gallery">Gallery</Link>
        </nav>
      </header>

      <div className="admin-card">
        <p className="section-label">Admin Access</p>
        <h2>Login to dashboard</h2>

        <form className="admin-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLoginPage;