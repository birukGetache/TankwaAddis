const express = require("express");
const { PostUser , LoginUser } = require("../controllers/authController");

const router = express.Router();

router.post("/user", PostUser);
router.post("/login", LoginUser);

module.exports = router;
