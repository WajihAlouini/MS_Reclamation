const express = require('express');
const router = express.Router();
const Reclamation = require('../models/Reclamation');

// GET all reclamations
router.get('/', async (req, res) => {
  try {
    const reclamations = await Reclamation.find();
    res.status(200).json(reclamations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a single reclamation by ID
router.get('/:id', async (req, res) => {
  try {
    const reclamation = await Reclamation.findById(req.params.id);
    if (!reclamation) {
      return res.status(404).json({ message: 'Reclamation not found' });
    }
    res.status(200).json(reclamation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE a new reclamation
router.post('/', async (req, res) => {
  const reclamation = new Reclamation(req.body);
  try {
    const newReclamation = await reclamation.save();
    res.status(201).json(newReclamation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE a reclamation
router.put('/:id', async (req, res) => {
  try {
    const updatedReclamation = await Reclamation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedReclamation) {
      return res.status(404).json({ message: 'Reclamation not found' });
    }
    res.status(200).json(updatedReclamation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a reclamation
router.delete('/:id', async (req, res) => {
  try {
    const reclamation = await Reclamation.findByIdAndDelete(req.params.id);
    if (!reclamation) {
      return res.status(404).json({ message: 'Reclamation not found' });
    }
    res.status(200).json({ message: 'Reclamation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;