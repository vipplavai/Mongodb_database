const WebScrapedData = require('../models/webScrapedData');
const CleanedWebScrapedData = require('../models/cleanedWebScrapedData');
const SkippedWebScrapedData = require('../models/skippedWebScrapedData');
const User = require('../models/user');

exports.assignDataChunks = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    // Fetch unassigned data chunks and mark them as assigned atomically
    const unassignedChunks = await WebScrapedData.find({ isAssigned: false }).limit(10);
    const chunkIds = unassignedChunks.map(chunk => chunk._id);

    // Update the assignedTo field of the data chunks
    await WebScrapedData.updateMany(
      { _id: { $in: chunkIds } },
      { $set: { isAssigned: true, assignedTo: userId } }
    );

    // Update user's assignedChunks
    user.assignedChunks.push(...chunkIds);
    await user.save();

    res.status(200).json({ message: 'Data chunks assigned successfully', chunks: unassignedChunks });
  } catch (error) {
    res.status(500).json({ message: 'Error assigning data chunks', error });
  }
};

exports.cleanData = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    const { cleanedChunks } = req.body; // Expecting an array of cleaned chunks in the request body

    // Fetch assigned data chunks for the user
    const assignedChunks = await WebScrapedData.find({ _id: { $in: user.assignedChunks } });
    const assignedTitles = assignedChunks.map(chunk => chunk.title);

    // Arrays to hold data for bulk insert
    const cleanedData = [];
    const skippedData = [];

    // Process each cleaned chunk
    for (let cleanedChunk of cleanedChunks) {
      if (assignedTitles.includes(cleanedChunk.title)) {
        if (cleanedChunk.saved) {
          // If saved is true, add to cleanedData
          cleanedData.push({
            ...cleanedChunk,
            assignedTo: userId
          });

          // Check if this chunk exists in the skipped collection
          const skippedChunk = await SkippedWebScrapedData.findOne({ title: cleanedChunk.title, assignedTo: userId });
          if (skippedChunk) {
            // If found, remove from skipped collection
            await SkippedWebScrapedData.deleteOne({ _id: skippedChunk._id });
          }
        } else if (cleanedChunk.skipped) {
          // If skipped is true, add to skippedData
          skippedData.push({
            ...cleanedChunk,
            assignedTo: userId
          });
        }
      } else {
        // Log if the chunk title is not found in assigned titles
        console.log('Chunk title not found in assigned titles:', cleanedChunk.title);
      }
    }

    // Insert the cleaned and skipped data
    if (cleanedData.length > 0) {
      await CleanedWebScrapedData.insertMany(cleanedData);
      console.log('Inserted cleaned data:', cleanedData);

      // Increment the noOfChunksCompleted field for the user
      user.noOfChunksCompleted += cleanedData.length;
    }
    if (skippedData.length > 0) {
      await SkippedWebScrapedData.insertMany(skippedData);
      console.log('Inserted skipped data:', skippedData);
    }

    // Update user's assignedChunks by removing the processed ones
    const processedTitles = cleanedData.map(chunk => chunk.title).concat(skippedData.map(chunk => chunk.title));
    user.assignedChunks = user.assignedChunks.filter(chunkId => {
      const chunk = assignedChunks.find(c => c._id.equals(chunkId));
      return !processedTitles.includes(chunk.title);
    });
    await user.save();

    res.status(200).json({ message: 'Data cleaned and categorized successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error cleaning data', error });
  }
};

exports.getAssignedChunks = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch assigned data chunks for the user
    const assignedChunks = await WebScrapedData.find({ assignedTo: userId });

    res.status(200).json({ assignedChunks });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assigned data chunks', error });
  }
};
