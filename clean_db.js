require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL + '?sslmode=require' });

async function run() {
  try {
    const res = await pool.query("SELECT id, marketing_data FROM courses WHERE slug='ai-super-kids'");
    if (res.rows.length === 0) return;
    
    let marketingData = res.rows[0].marketing_data;
    
    if (marketingData.whyDigitalGhuru && marketingData.whyDigitalGhuru.reasons) {
      marketingData.whyDigitalGhuru.reasons = marketingData.whyDigitalGhuru.reasons.map(r => {
        delete r.color;
        delete r.numBg;
        delete r.dotColor;
        return r;
      });
      
      await pool.query(
        "UPDATE courses SET marketing_data = $1 WHERE id = $2",
        [marketingData, res.rows[0].id]
      );
      console.log("Successfully cleaned hardcoded colors from the database!");
    }
  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}

run();
