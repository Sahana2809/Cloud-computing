const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const checkLaps = async () => {
  try {
    console.log('Checking laps...\n');
    
    const laps = await pool.query(`
      SELECT l.*, u.username, u.email 
      FROM laps l 
      JOIN users u ON l.user_id = u.id 
      ORDER BY l.created_at DESC
    `);
    
    console.log(`Total laps: ${laps.rows.length}\n`);
    
    if (laps.rows.length > 0) {
      laps.rows.forEach(lap => {
        console.log(`Lap ID: ${lap.id}`);
        console.log(`User: ${lap.username} (${lap.email})`);
        console.log(`Time: ${lap.lap_time}`);
        console.log(`Type: ${lap.type}`);
        console.log(`Created: ${lap.created_at}`);
        console.log('---');
      });
    } else {
      console.log('No laps found');
    }
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

checkLaps();
