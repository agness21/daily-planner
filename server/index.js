const express = require('express');
const cors = require('cors');

require('dotenv').config(); //lire le fichier .env

const app = express(); //cree l'app express
const PORT = process.env.PORT || 5000; 

app.use(cors()); //autorisre les requetes cross-origin
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
