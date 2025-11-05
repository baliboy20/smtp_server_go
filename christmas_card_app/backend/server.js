require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/christmas_cards';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    console.log(`📦 Database: ${mongoose.connection.db.databaseName}`);
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

// Card Schema
const cardSchema = new mongoose.Schema({
  recipientName: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    default: null
  },
  phoneNumber: {
    type: String,
    trim: true,
    default: null
  },
  cardSent: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    trim: true,
    default: null
  },
  dateSent: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
cardSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Card = mongoose.model('Card', cardSchema);

// Routes

// Health check
app.get('/', (req, res) => {
  res.json({
    message: 'Christmas Card API is running! 🎄',
    endpoints: {
      'GET /api/cards': 'Get all cards',
      'GET /api/cards/:id': 'Get a card by ID',
      'POST /api/cards': 'Create a new card',
      'PUT /api/cards/:id': 'Update a card',
      'DELETE /api/cards/:id': 'Delete a card',
      'GET /api/cards/stats': 'Get statistics'
    }
  });
});

// GET all cards
app.get('/api/cards', async (req, res) => {
  try {
    const cards = await Card.find().sort({ createdAt: -1 });
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET card by ID
app.get('/api/cards/:id', async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }
    res.json(card);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new card
app.post('/api/cards', async (req, res) => {
  try {
    const card = new Card(req.body);
    const savedCard = await card.save();
    res.status(201).json(savedCard);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update card
app.put('/api/cards/:id', async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }
    res.json(card);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE card
app.delete('/api/cards/:id', async (req, res) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.id);
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }
    res.json({ message: 'Card deleted successfully', card });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET statistics
app.get('/api/stats', async (req, res) => {
  try {
    const total = await Card.countDocuments();
    const sent = await Card.countDocuments({ cardSent: true });
    const remaining = await Card.countDocuments({ cardSent: false });

    res.json({
      total,
      sent,
      remaining
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 API endpoints available at http://localhost:${PORT}/api/cards`);
});
