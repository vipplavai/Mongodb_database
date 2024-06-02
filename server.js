const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json()); // To parse JSON bodies

// MongoDB connection string
mongoose.connect('mongodb://localhost:27017/excel', { useNewUrlParser: true, useUnifiedTopology: true });

const teluguTextSchema = new mongoose.Schema({
    text: String,
    romanisedInputs: String,
    phoneticGuide: String,
});

const Telugu_Words = mongoose.model('Telugu_Words', teluguTextSchema, 'new');

// Logging middleware to log incoming requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

app.get('/telugu-text', async (req, res) => {
    try {
        const textData = await Telugu_Words.findOne();
        res.json(textData);
    } catch (error) {
        res.status(500).send(error);
    }
});

// POST route to update the document with text, romanisedInputs, and phoneticGuide
app.post('/update-telugu-text', async (req, res) => {
    try {
        const { text, romanisedInputs, phoneticGuide } = req.body;

        // Update the first document in the collection
        const updatedTextData = await Telugu_Words.findOneAndUpdate(
            {},
            { text, romanisedInputs, phoneticGuide },
            { new: true }
        );

        res.json(updatedTextData);
    } catch (error) {
        res.status(500).send(error);
    }
});

// GET route to fetch the next Telugu text
app.get('/next-telugu-text', async (req, res) => {
    try {
        const lastId = parseInt(req.query.lastId, 10);
        console.log(lastId);

        // If no lastId is provided, fetch the first document
        let query = {};
        if (lastId) {
            query = { _id: { $gt: lastId } };
        }

        const textData = await Telugu_Words.find(query).sort({ _id: 1 }).limit(1);

        if (textData.length > 0) {
            res.json(textData[0]);
        } else {
            res.json({ message: 'No more text available' });
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

// GET route to fetch the previous Telugu text
app.get('/previous-telugu-text', async (req, res) => {
    try {
        const textData = await Telugu_Words.findOne(); // Adjust this logic based on how you determine the "previous" text
        res.json(textData);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
