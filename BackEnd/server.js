const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static uploads - use relative paths in database
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', reportRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Uploads served at http://localhost:${PORT}/uploads`);
});
