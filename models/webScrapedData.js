const mongoose = require('mongoose');

const webScrapedDataSchema = new mongoose.Schema({
  title: String,
  href: String,
  category: String,
  content: [String],
  isAssigned: { type: Boolean, default: false },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
});

const WebScrapedData = mongoose.model('WebScrapedData', webScrapedDataSchema);

module.exports = WebScrapedData;