const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pool = require("../db");

const router = express.Router();

const uploadPath = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

router.post("/", upload.single("image"), async (req, res) => {
  const { title, category, type } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "Image required" });
  }

  const id = Date.now();
  const imageUrl = `https://randomfoto-portfolio.onrender.com/uploads/${req.file.filename}`;

  try {
    if (type === "cover") {
      await pool.query(`DELETE FROM photos WHERE type = 'cover'`);
    }

    await pool.query(
      `INSERT INTO photos (id, title, category, type, image_url)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, title, category, type, imageUrl]
    );

    res.status(201).json({
      id,
      title,
      category,
      type,
      imageUrl,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        id,
        title,
        category,
        type,
        parent_id AS "parentId",
        image_url AS "imageUrl"
       FROM photos
       ORDER BY created_at DESC`
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/multi/:id", upload.array("images", 30), async (req, res) => {
  const { id } = req.params;

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "Images required" });
  }

  try {
    const inserted = [];

    for (const file of req.files) {
      const photoId = Date.now() + Math.floor(Math.random() * 10000);
      const imageUrl = `https://randomfoto-portfolio.onrender.com/uploads/${file.filename}`;

      await pool.query(
        `INSERT INTO photos (id, title, category, type, parent_id, image_url)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [photoId, `Image ${file.originalname}`, "gallery", "gallery", id, imageUrl]
      );

      inserted.push({
        id: photoId,
        title: `Image ${file.originalname}`,
        category: "gallery",
        type: "gallery",
        parentId: id,
        imageUrl,
      });
    }

    res.json({
      message: "Multiple images uploaded",
      files: inserted,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE ALBUM + CHILD PHOTOS
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // get album + child photos first so we can remove image files too
    const result = await pool.query(
      `SELECT id, image_url AS "imageUrl"
       FROM photos
       WHERE id = $1 OR parent_id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Album not found" });
    }

    // delete database rows
    await pool.query(
      `DELETE FROM photos
       WHERE id = $1 OR parent_id = $1`,
      [id]
    );

    // delete files from uploads folder
    for (const photo of result.rows) {
      if (!photo.imageUrl) continue;

      const fileName = photo.imageUrl.split("/").pop();
      const filePath = path.join(uploadPath, fileName);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.json({ message: "Album and related photos deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;