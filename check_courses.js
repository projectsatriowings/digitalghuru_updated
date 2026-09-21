require('dotenv').config();
const http = require('http');

http.get('http://localhost:3000/api/courses', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const courses = JSON.parse(data);
    console.log('Total courses returned:', courses.length);
    console.log('\n--- Course Details ---');
    courses.forEach((c, i) => {
      const md = c.marketing_data || {};
      console.log(`\n[${i+1}] ${c.title}`);
      console.log('  slug:', c.slug);
      console.log('  price (DB):', c.price);
      console.log('  discountedPrice (marketing):', md.discountedPrice);
      console.log('  originalPrice (marketing):', md.originalPrice);
      console.log('  format:', md.format);
      console.log('  duration:', md.duration);
      console.log('  cardImage:', md.cardImage || 'NONE');
      console.log('  description:', (c.description || '').substring(0, 80));
    });
  });
}).on('error', e => console.error(e));
