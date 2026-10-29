const express = require('express');
const mongoose = require('mongoose');
const os = require('os');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

let requestCount = 0;
app.use((req, res, next) => {
  if (req.path !== '/health') requestCount++;
  next();
});

const MONGO_URL = process.env.MONGO_URL || 'mongodb://db:27017/myappdb';
mongoose.connect(MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const Note = mongoose.model('Note', new mongoose.Schema({
  text: String,
  createdAt: { type: Date, default: Date.now }
}));

app.get('/whoami', (req, res) => {
  res.send(`Served by container: ${os.hostname()}`);
});

app.get('/api/info', (req, res) => {
  res.json({ hostname: os.hostname() });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.get('/metrics', (req, res) => {
  res.json({
    hostname: os.hostname(),
    uptimeSeconds: Math.round(process.uptime()),
    requestsHandled: requestCount
  });
});

app.post('/notes', async (req, res) => {
  try {
    const note = new Note({ text: req.body.text });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/notes/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, { text: req.body.text }, { new: true });
    if (!note) return res.status(404).json({ error: 'Not found' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/notes/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ error: 'Not found' });
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
