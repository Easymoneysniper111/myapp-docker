const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

app.use(express.json());

// MongoDB-тай холбогдох
const MONGO_URL = process.env.MONGO_URL || 'mongodb://db:27017/myappdb';
mongoose.connect(MONGO_URL)
  .then(() => console.log('MongoDB is connected'))
  .catch((err) => console.error('Error', err));

// Note загвар
const Note = mongoose.model('Note', new mongoose.Schema({
  text: String,
  createdAt: { type: Date, default: Date.now }
}));

app.get('/', (req, res) => {
  res.send('Hello Cloud! My Node.js app is running in Docker.');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Шинэ note нэмэх
app.post('/notes', async (req, res) => {
  try {
    const note = new Note({ text: req.body.text });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Бүх note харах
app.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
