const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get user's laps
router.get('/', authMiddleware, async (req, res) => {
  try {
    console.log('Fetching laps for user:', req.userId); // Debug
    const result = await pool.query(
      'SELECT * FROM laps WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );
    console.log('Laps found:', result.rows.length); // Debug
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching laps:', error);
    res.status(500).json({ message: 'Error fetching laps', error: error.message });
  }
});

// Add new lap
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { lap_time, type } = req.body;
    console.log('Adding lap:', { user_id: req.userId, lap_time, type }); // Debug
    
    const result = await pool.query(
      'INSERT INTO laps (user_id, lap_time, type) VALUES ($1, $2, $3) RETURNING *',
      [req.userId, lap_time, type]
    );
    
    console.log('Lap created:', result.rows[0]); // Debug
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding lap:', error);
    res.status(500).json({ message: 'Error adding lap', error: error.message });
  }
});

// Delete lap
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM laps WHERE id = $1 AND user_id = $2', [req.params.id, req.userId]);
    res.json({ message: 'Lap deleted' });
  } catch (error) {
    console.error('Error deleting lap:', error);
    res.status(500).json({ message: 'Error deleting lap', error: error.message });
  }
});

// Get lap statistics
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        type,
        COUNT(*) as count,
        MAX(created_at) as last_lap
       FROM laps 
       WHERE user_id = $1 
       GROUP BY type`,
      [req.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
});

module.exports = router;
