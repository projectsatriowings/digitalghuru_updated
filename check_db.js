require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL + '?sslmode=require' });
pool.query("SELECT marketing_data->'whyDigitalGhuru' as why FROM courses WHERE slug='ai-super-kids'").then(res => { 
  console.log(JSON.stringify(res.rows[0], null, 2)); 
  pool.end(); 
});
