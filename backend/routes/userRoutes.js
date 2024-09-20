const express = require("express");
const userController = require("../controller/userController");
const isAuthenticated = require("../middlewares/isAuth");
const upload = require('../utils/multer')

const router = express.Router();

//!Register
router.post('/register', upload.single('image'), userController.register);
router.post("/login", userController.login);
router.get("/get-profile", isAuthenticated, userController.profile);

module.exports = router;