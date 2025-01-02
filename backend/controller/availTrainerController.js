const AvailTrainer = require('../model/availTrainer');

// Create a new trainer
exports.createTrainer = async (req, res) => {
    try {
        const trainer = new AvailTrainer(req.body);
        await trainer.save();
        res.status(201).json({ message: 'Trainer created successfully', trainer });
    } catch (error) {
        res.status(400).json({ message: 'Error creating trainer', error: error.message });
    }
};

// Get all trainers
exports.getAllTrainers = async (req, res) => {
    try {
        const trainers = await AvailTrainer.find();
        res.status(200).json(trainers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching trainers', error: error.message });
    }
};

// Get a specific trainer by ID
exports.getTrainerById = async (req, res) => {
    try {
        const trainer = await AvailTrainer.findById(req.params.id);
        if (!trainer) {
            return res.status(404).json({ message: 'Trainer not found' });
        }
        res.status(200).json(trainer);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching trainer', error: error.message });
    }
};

// Update a trainer by ID
exports.updateTrainer = async (req, res) => {
    try {
        const trainer = await AvailTrainer.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!trainer) {
            return res.status(404).json({ message: 'Trainer not found' });
        }
        res.status(200).json({ message: 'Trainer updated successfully', trainer });
    } catch (error) {
        res.status(400).json({ message: 'Error updating trainer', error: error.message });
    }
};

// Delete a trainer by ID
exports.deleteTrainer = async (req, res) => {
    try {
        const trainer = await AvailTrainer.findByIdAndDelete(req.params.id);
        if (!trainer) {
            return res.status(404).json({ message: 'Trainer not found' });
        }
        res.status(200).json({ message: 'Trainer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting trainer', error: error.message });
    }
};
