require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dataRoutes = require('./routes/dataRoutes');
const authRoutes = require('./routes/authRoutes');
const errorMiddleware = require('./middleware/error');
const app = express();

// const mongoURI = 'mongodb://127.0.0.1/web-scraper';
const port = process.env.PORT || 5000;
console.log("PORT:", port); // Debug statement
mongoose.connect(process.env.MONGO_URL)
.then((data) => {
  console.log(`Mongodb connected with server: ${data.connection.host}`);
})
.catch((err) => {
  console.error("MongoDB connection error:", err);
});

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());


app.use('/api', dataRoutes);
app.use('/api', authRoutes);
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
