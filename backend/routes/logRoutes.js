const express = require("express");
const logsController = require("../controller/logsController");
const isAuthenticated = require("../middlewares/isAuth");

const router = express.Router();
// router.post('/create-exercise', upload.array('image[]'), exerciseController.createExercise);
router.get('/get-all-logs', logsController.getAllLogs);
router.get('/get-my-logs/:id', logsController.getMyLogs);


module.exports = router;