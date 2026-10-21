const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./db'); 

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Lab Equipment Borrowing API is running successfully with MongoDB!');
});

// Call the database connection function
connectDB();

// 📋 Define Mongoose Schema & Model
const equipmentSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  category: { type: String, default: 'General' },
  borrowerName: { type: String, required: true },
  courseSection: { type: String, default: 'N/A' },
  dateBorrowed: { type: String, required: true },
  dueDate: { type: String, required: true },
  remarks: { type: String, default: 'Good condition' },
  status: { type: String, default: 'Borrowed' }
}, {
  timestamps: true
});

equipmentSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  }
});

const Equipment = mongoose.model('Equipment', equipmentSchema);

// ---------------- REST API ROUTES ----------------

app.get('/api/equipment', async (req, res) => {
  try {
    const items = await Equipment.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch equipment records.' });
  }
});

app.post('/api/equipment', async (req, res) => {
  try {
    const { itemName, borrowerName, dateBorrowed } = req.body;

    if (!itemName || !borrowerName || !dateBorrowed) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    const newItem = new Equipment({
      itemName,
      borrowerName,
      dateBorrowed,
      dueDate: dateBorrowed, 
      status: 'Borrowed'
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save record.' });
  }
});

app.patch('/api/equipment/:id/return', async (req, res) => {
  try {
    const updatedItem = await Equipment.findByIdAndUpdate(
      req.params.id,
      { status: 'Returned' },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: 'Item not found.' });
    }

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update record status.' });
  }
});

app.delete('/api/equipment/:id', async (req, res) => {
  try {
    const deletedItem = await Equipment.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({ error: 'Item not found.' });
    }

    res.json({ message: 'Record deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete record.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});