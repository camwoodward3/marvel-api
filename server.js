const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('../db/connect');
const session = require('express-session');
const passport = require('passport');
// const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

require('dotenv').config();
require('./config/passport');

const app = express();
const PORT = process.env.PORT || 5050;


app.set('trust proxy', 1);
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection
// Health check
app.get('/', (req, res) => res.send('API is running'));

// Routes
app.use('/api/characters', require('./routes/characters'));
app.use('/api/movies', require('./routes/movies'));
app.use('/api/comics', require('./routes/comics'));
app.use('/auth', require('./routes/auth'));


mongodb.initDb((err) => {
  if (err) {
    console.error('Failed to connect to MongoDB:', err);
  } else {
    app.listen(PORT, () => {
      console.log(`Connected to DB and listening on port ${PORT}`);
    })
  }
})
