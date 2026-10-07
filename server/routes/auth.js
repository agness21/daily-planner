const express = require('express');
const bcrypt = require('bcryptjs'); //cypter le mot de passe dans la bdd
const jwt = require('jsonwebtoken'); //pour générer un token
const pool = require('../db'); //connection à la bdd

const router = express.Router(); // Créer un routeur pour gérer les routes d'authentification

//INSCRIPTION

router.post('/register', async (req, res) => {
    const { email, motPasse } = req.body;
    if (!email || !motPasse) {
        return res.status(400).json({ error: 'Email et mot de passe requis' });
    }
    try {
    const hash = await bcrypt.hash(motPasse, 10); // Hash du mot de passe

    const result = await pool.query(
        'INSERT INTO users (email, motpasse) VALUES ($1, $2) RETURNING id, email',
        [email, hash]);
        res.status(201).json(result.rows[0]);
    }
    catch (err) {
        if (err.code === '23505') { // Code d'erreur pour violation de contrainte unique
            return res.status(400).json({ error: 'Email déjà utilisé' });
        }
        res.status(500).json({ error: 'Erreur serveur' });
    }
});


//CONNEXION

router.post('/login', async (req, res) => {
    const { email, motPasse } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];
        if (!user || !(await bcrypt.compare(motPasse, user.motpasse))) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user.id, email: user.email } });
    }
    catch (err) {
    res.status(500).json({ error: err.message });
    }
});

module.exports = router; // Exporter le routeur pour l'utiliser dans index.js