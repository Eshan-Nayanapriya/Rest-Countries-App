const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// Get all favorites for current user
router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ favorites: user.favorites });
});

// Add a country to favorites
router.post("/add", auth, async (req, res) => {
  const { countryCode } = req.body;
  if (!countryCode)
    return res.status(400).json({ message: "Country code required" });
  const user = await User.findById(req.user.id);
  if (!user.favorites.includes(countryCode)) {
    user.favorites.push(countryCode);
    await user.save();
  }
  res.json({ favorites: user.favorites });
});

// Remove a country from favorites
router.post("/remove", auth, async (req, res) => {
  const { countryCode } = req.body;
  if (!countryCode)
    return res.status(400).json({ message: "Country code required" });
  const user = await User.findById(req.user.id);
  user.favorites = user.favorites.filter((code) => code !== countryCode);
  await user.save();
  res.json({ favorites: user.favorites });
});

module.exports = router;
