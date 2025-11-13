const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get user's laps
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM laps WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching laps', error: error.message });
  }
});

// Add new lap
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { lap_time, type } = req.body;
    
    const result = await pool.query(
      'INSERT INTO laps (user_id, lap_time, type) VALUES ($1, $2, $3) RETURNING *',
      [req.userId, lap_time, type]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error adding lap', error: error.message });
  }
});

// Delete lap
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM laps WHERE id = $1 AND user_id = $2', [req.params.id, req.userId]);
    res.json({ message: 'Lap deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting lap', error: error.message });
  }
});

module.exports = router;
