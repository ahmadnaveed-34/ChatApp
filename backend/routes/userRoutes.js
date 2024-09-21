const express = require("express");
const router = express.Router();

const { registerUser } = require("../controllers/userControllers");
const { authUser } = require("../controllers/userControllers");
const { allUser } = require("../controllers/userControllers");
const protect = require("../middleware/authMiddleware");

router.post("/", registerUser);
router.post("/login", authUser);
router.get("/", protect, allUser);

module.exports = router;
