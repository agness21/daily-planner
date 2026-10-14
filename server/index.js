const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');

const planRoutes = require('./routes/plans');

const tachesRoutes = require('./routes/taches');

const eauRoutes = require('./routes/eau');

require('dotenv').config(); //lire le fichier .env

const app = express(); //cree l'app express
const PORT = process.env.PORT || 5000; 

app.use(cors()); //autorisre les requetes cross-origin
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/taches', tachesRoutes);
app.use('/api/eau', eauRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});