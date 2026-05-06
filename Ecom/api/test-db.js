const pool = require('./db.js');

async function test() {
    try {
        console.log('Testing DB connection...');
        const [rows] = await pool.query('SELECT * FROM categories');
        console.log('Categories found:', rows);
        process.exit(0);
    } catch (e) {
        console.error('Test failed:', e);
        process.exit(1);
    }
}

test();

