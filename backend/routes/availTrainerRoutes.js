const express = require('express');
const router = express.Router();
const availTrainerController = require('../controller/availTrainerController');

router.post('/', availTrainerController.createTrainer);
router.get('/', availTrainerController.getAllTrainers);
router.get('/:id', availTrainerController.getTrainerById);
router.put('/:id', availTrainerController.updateTrainer);
router.delete('/:id', availTrainerController.deleteTrainer);

module.exports = router;