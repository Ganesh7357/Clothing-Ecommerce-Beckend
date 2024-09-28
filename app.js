const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config');
const path = require('path');
const cors = require('cors');


const app = express();
// Bodyparser Middleware
app.use(bodyParser.json());
app.use(cors());
// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// DB Config
const db = config.mongoURI;

// Connect to MongoDB
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        next();
      });
// Define Routes
app.use('/user', require('./routes/users/index'));
app.use('/products', require('./routes/product/index'));
// app.use('/profile', require('./routes/profile'));
// app.use('/wishlist', require('./routes/wishlist'));



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port http://localhost:${PORT}`));
