const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

const authRoutes = require("./routes/authRoutes");
const photoRoutes = require("./routes/photoRoutes");
const pool = require("./db");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Random Foto API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/photos", photoRoutes);

app.get("/api/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      success: true,
      time: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.get("/download/:filename", (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.params.filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("File not found");
  }

  res.download(filePath);
});

app.get("/api/init-db", async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS photos (
        id BIGINT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT,
        type TEXT NOT NULL,
        parent_id BIGINT,
        image_url TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    res.json({ success: true, message: "Database initialized" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});