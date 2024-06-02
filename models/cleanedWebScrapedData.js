const mongoose = require('mongoose');

// Cleaned Web Scraped Data Schema
const cleanedWebScrapedDataSchema = new mongoose.Schema({
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

const cleanedWebScrapedData = mongoose.model('cleanedWebScrapedData', cleanedWebScrapedDataSchema);

module.exports = cleanedWebScrapedData;