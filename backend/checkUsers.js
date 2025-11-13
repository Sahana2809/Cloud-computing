const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const checkUsers = async () => {
  try {
    const result = await pool.query('SELECT id, username, email, created_at FROM users');
    
    console.log('Total users:', result.rows.length);
    console.log('\nUsers in database:');
    result.rows.forEach(user => {
      console.log(`- ID: ${user.id}, Username: ${user.username}, Email: ${user.email}, Created: ${user.created_at}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking users:', error);
    process.exit(1);
  }
};

checkUsers();
