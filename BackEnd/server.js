const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads')); // serve static images

app.use('/api', reportRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
