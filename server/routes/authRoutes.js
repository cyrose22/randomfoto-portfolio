const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USER &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign(
      { username: process.env.ADMIN_USER },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      token,
      user: {
        username: process.env.ADMIN_USER,
      },
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid username or password",
  });
});

module.exports = router;