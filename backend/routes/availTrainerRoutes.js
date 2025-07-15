const express = require('express');
const router = express.Router();
const availTrainerController = require('../controller/availTrainerController');

router.post('/create', availTrainerController.createTrainer);
router.post('/', availTrainerController.getAllTrainers);
router.get('/:id', availTrainerController.getTrainerById);
router.put('/:id', availTrainerController.updateTrainer);
router.delete('/:id', availTrainerController.deleteTrainer);
router.post('/avail-trainer-payment-intent', availTrainerController.createPaymentIntent);
router.get('/coach/:id', availTrainerController.getByAssignedCoach);
router.get('/client/:id', availTrainerController.getClientsAvailedServices);
router.put('/update/session/:id', availTrainerController.updateSessionSchedule);
router.put('/cancel/session/:id', availTrainerController.cancelSessionSchedule);
router.put('/complete/session/:id', availTrainerController.completeSessionSchedule);
router.put('/complete/session/client/:id', availTrainerController.completeSessionScheduleClient);
router.put('/complete/session/client/rate/:id', availTrainerController.completeSessionScheduleClientRate);
router.get('/has-active/:id', availTrainerController.hasActiveTraining);
router.get('/coach/recent-session/:coachId', availTrainerController.getCoachDateSessions);


module.exports = router;