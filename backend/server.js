require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const userRoute = require('./routes/userRouter');
const articleRoute = require('./routes/articleRoutes');
const statisticsRoutes = require('./routes/analytics');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 5000;

app.use(cookieParser());
app.set('trust proxy', 1);
app.use(express.json());
app.use(bodyParser.json());
app.use('/public', express.static(path.join(__dirname, 'public')));
require('./config/db');
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
  })
);
app.use('/api/users', userRoute);
app.use('/api/articles', articleRoute);
app.use('/api/statistics', statisticsRoutes);
app.listen(PORT, () => {
  console.log(`Server running on ${PORT} port`);
});
