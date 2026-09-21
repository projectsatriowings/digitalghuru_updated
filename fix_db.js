require('dotenv').config();
const { Pool } = require('pg'); 
const pool = new Pool({ connectionString: process.env.DATABASE_URL + '?sslmode=require' }); 

async function run() { 
  try { 
    await pool.query('ALTER TABLE modules ADD COLUMN "isPublished" BOOLEAN DEFAULT true;'); 
    console.log('Added isPublished to modules'); 
  } catch(e) { 
    console.error('Modules error:', e.message); 
  } 
  
  try { 
    await pool.query('ALTER TABLE chapters ADD COLUMN "isPublished" BOOLEAN DEFAULT true;'); 
    console.log('Added isPublished to chapters'); 
  } catch(e) { 
    console.error('Chapters error:', e.message); 
  } 
  
  pool.end(); 
} 

run();
