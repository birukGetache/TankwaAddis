const express = require("express");
const { PostUser , LoginUser , LoginBoatOwner } = require("../controllers/authController");

const router = express.Router();

router.post("/user", PostUser);
router.post("/login", LoginUser);
router.post("/login" , LoginBoatOwner)
module.exports = router;
