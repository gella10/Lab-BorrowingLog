const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  type: { 
    type: String, 
    required: true, 
    enum: ['lost', 'found'] 
  },
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  dateEvent: { type: Date, required: true },
  image: { type: String },
  status: { 
    type: String, 
    required: true, 
    default: 'pending', 
    enum: ['pending', 'approved', 'rejected', 'claimed', 'returned'] 
  },
  rejectReason: { type: String },
  reportedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Item', itemSchema);