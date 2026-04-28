const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const reviewRoutes = require('./routes/review');
const returnRoutes = require('./routes/return');
const pointRoutes = require('./routes/point');
const qrRoutes = require('./routes/qr');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/returns', returnRoutes);
app.use('/api/points', pointRoutes);
app.use('/api/qr', qrRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'EkoKintsugi API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
