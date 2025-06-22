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
router.get('/get-all-users', userController.getAllUsers);
router.post('/user-log/:id', userController.userLog);
router.post('/progress-input/:id', userController.userProgressInput);
router.post('/get-timedin-logs', userController.getTimeInLogs);
router.post('/rating', userController.userRating);
router.get('/get-ratings/:id', userController.getCoachRatings);
router.get('/get-ratings/:id', userController.getCoachRatings);
router.post('/coach-clients', userController.getCoachClients);
router.put('/downgrade-role/:id', userController.changeUserRole);
router.get("/chat-users", userController.chatUsers);

module.exports = router;