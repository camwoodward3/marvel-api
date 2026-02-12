const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.log('MongoDB connection error:', err);
    process.exit(1);
  });

// Health check
app.get('/', (req, res) => res.send('API is running'));

// Routes
app.use('/api/characters', require('./routes/characters'));
app.use('/api/movies', require('./routes/movies'));
app.use('/api/comics', require('./routes/comics'));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
