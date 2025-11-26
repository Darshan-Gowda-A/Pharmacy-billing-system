const express = require('express');
const auth = require('../middleware/auth');
const Medicine = require('../models/Medicine');

const router = express.Router();

// GET /api/medicines
router.get('/', auth, async (req, res) => {
  try {
    const meds = await Medicine.find().sort({ name: 1 });
    res.json(meds);
  } catch (err) {
    console.error('GET /medicines error', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /api/medicines
router.post('/', auth, async (req, res) => {
  try {
    const m = new Medicine(req.body);
    await m.save();
    res.status(201).json(m);
  } catch (err) {
    console.error('POST /medicines error', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// PUT /api/medicines/:id
router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ msg: 'Medicine not found' });
    res.json(updated);
  } catch (err) {
    console.error('PUT /medicines/:id error', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// DELETE /api/medicines/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    await Medicine.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Deleted' });
  } catch (err) {
    console.error('DELETE /medicines/:id error', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
