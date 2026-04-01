const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const uploadPath = path.join(__dirname, "../uploads");
const dataPath = path.join(__dirname, "../data/photos.json");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

if (!fs.existsSync(path.join(__dirname, "../data"))) {
  fs.mkdirSync(path.join(__dirname, "../data"), { recursive: true });
}

if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, JSON.stringify([]));
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

const getPhotos = () => {
  const data = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(data);
};

const savePhotos = (photos) => {
  fs.writeFileSync(dataPath, JSON.stringify(photos, null, 2));
};

router.post("/", upload.single("image"), (req, res) => {
  const { title, category, type } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "Image required" });
  }

  let photos = getPhotos();

  const photo = {
    id: Date.now(),
    title,
    category,
    type,
    imageUrl: `http://localhost:5000/uploads/${req.file.filename}`,
  };

  if (type === "cover") {
    photos = photos.filter((item) => item.type !== "cover");
  }

  photos.push(photo);
  savePhotos(photos);

  res.status(201).json(photo);
});

router.get("/", (req, res) => {
  const photos = getPhotos();
  res.json(photos);
});

router.post("/multi/:id", upload.array("images", 30), (req, res) => {
  const { id } = req.params;

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "Images required" });
  }

  let photos = getPhotos();

  const newPhotos = req.files.map((file) => ({
    id: Date.now() + Math.floor(Math.random() * 10000),
    title: `Image ${file.originalname}`,
    category: "gallery",
    type: "gallery",
    parentId: id,
    imageUrl: `http://localhost:5000/uploads/${file.filename}`,
  }));

  photos.push(...newPhotos);
  savePhotos(photos);

  res.json({
    message: "Multiple images uploaded",
    files: newPhotos,
  });
});

module.exports = router;