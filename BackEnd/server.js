const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const reportRoutes = require('./routes/reportRoutes');
const signupRoutes = require('./routes/signupRoutes');
const authRoutes = require('./routes/authRoutes');
const taxpayerRoutes = require('./routes/taxpayerRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const adminRoutes = require('./routes/adminRoutes');
const adminDataRoutes = require('./routes/adminDataRoutes');
const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static uploads - use relative paths in database
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', reportRoutes);
app.use('/api', signupRoutes);
app.use('/api', authRoutes);
app.use('/api', taxpayerRoutes);
app.use('/api', paymentRoutes);
app.use('/api', galleryRoutes);
app.use('/api', adminRoutes);
app.use('/api', adminDataRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Uploads served at http://localhost:${PORT}/uploads`);
});
