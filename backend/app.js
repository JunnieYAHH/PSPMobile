const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Specify the correct path to the config.env file
const envPath = path.resolve(__dirname, 'config', 'config.env');
// console.log(envPath)
dotenv.config({ path: envPath });
// console.log(process.env.JWT_SECRET);

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Connect to MongoDB
mongoose.connect("mongodb+srv://gerelitopuyos:gerelitopuyos@atlascluster.7cyczkf.mongodb.net/PSPMobile?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log("Error connecting to MongoDB", err);
});

// Routes
// app.use('/api/v1/users', userRoutes);

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});