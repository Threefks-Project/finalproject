const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'municipality',   // Your DB name
});

db.connect((err) => {
  if (err) {
    console.error('DB connection error:', err);
    process.exit(1); // Optionally exit the process if DB connection fails
  }
  console.log('Connected to MySQL DB');
});

module.exports = db;
