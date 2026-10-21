const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  itemId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Item', 
    required: true 
  },
  claimantId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  proof: { type: String, required: true },
  status: { 
    type: String, 
    required: true, 
    default: 'pending', 
    enum: ['pending', 'approved', 'rejected'] 
  },
  adminNote: { type: String },
  reviewedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  returnedAt: { type: Date }
}, {
  timestamps: true
});


claimSchema.index({ itemId: 1, claimantId: 1 }, { unique: true });

module.exports = mongoose.model('Claim', claimSchema);