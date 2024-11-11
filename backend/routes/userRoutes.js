const express = require("express");
const userController = require("../controller/userController");
const { isAuthenticatedUser } = require("../middlewares/isAuth");
const upload = require('../utils/multer')

const router = express.Router();

//!Register
router.post('/register', upload.single('image'), userController.register);
router.post("/login", userController.login);
router.put('/update', upload.single('image'), userController.updateUser);
router.put('/update-password', isAuthenticatedUser, userController.updateUserPassword);
router.get('/get-user/:id', userController.getUser);
router.post('/user-log/:id', userController.userLog);

module.exports = router;