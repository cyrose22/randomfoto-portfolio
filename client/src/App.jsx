import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import GalleryPage from "./pages/GalleryPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminMultiUploadPage from "./pages/AdminMultiUploadPage";
import AlbumPage from "./pages/AlbumPage";
import PhotoViewPage from "./pages/PhotoViewPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/dashboard/:id" element={<AdminMultiUploadPage />} />
        <Route path="/gallery/:id" element={<AlbumPage />} />
        <Route path="/photo/:id" element={<PhotoViewPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;