const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'municipality',   // Your DB name
});

db.connect((err) => {
  if (err) {
  console.error('DB insert error:', err);
  return res.status(500).send('DB insert error: ' + err.message);
}

  console.log('Connected to MySQL DB');
});

module.exports = db;
