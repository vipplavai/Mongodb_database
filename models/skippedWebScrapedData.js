const mongoose = require('mongoose');

const skippedWebScrapedDataSchema = new mongoose.Schema({
  title: String,
  href: String,
  category: String,
  content: [String],
  saved: Boolean,
  skipped: Boolean,
  tags: [String],
  originalSentiment: String,
  timeSpent: Number,
  sentiment: String,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const SkippedWebScrapedData = mongoose.model('SkippedWebScrapedData', skippedWebScrapedDataSchema);

module.exports = SkippedWebScrapedData;
