const express = require('express');
const cors = require('cors');

// Importer les routes
const authRoutes = require('./routes/auth');
const planRoutes = require('./routes/plans');
const tachesRoutes = require('./routes/taches');
const eauRoutes = require('./routes/eau');
const humeurRoutes = require('./routes/humeur');


require('dotenv').config(); //lire le fichier .env

const app = express(); //cree l'app express
const PORT = process.env.PORT || 5000; 

app.use(cors()); //autorisre les requetes cross-origin
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/taches', tachesRoutes);
app.use('/api/eau', eauRoutes);
app.use('/api/humeur', humeurRoutes); // Ajouter la route pour l'humeur

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});