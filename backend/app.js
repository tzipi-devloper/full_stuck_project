const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes'); 
const authRoutes = require('./routes/authRoutes'); 
const dotenv = require('dotenv'); 
const cors = require('cors'); 
const app = express();
const PORT = process.env.PORT || 5050;

dotenv.config();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.CONECTION_URL)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
