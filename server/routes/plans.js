const express = require('express');
const pool = require('../db'); // Importer le pool de connexion à la base de données
const authToken = require('../middleware/authToken'); // Importer le middleware d'authentification

const router = express.Router(); // Créer un routeur pour gérer les routes des plans

// récuperer ou créer un planning s'il n'existe pas encore
router.get('/:date', authToken, async (req, res) => {
    const { date } = req.params; // Récupérer la date depuis les paramètres de l'URL
    try {
        let result = await pool.query(
            'SELECT * FROM daily_plan WHERE user_id = $1 AND date = $2',
            [req.userId, date]
        );
        let plan = result.rows[0];
        if (!plan) {
            result = await pool.query(
                'INSERT INTO daily_plan (user_id, date) VALUES ($1, $2) RETURNING *',
                [req.userId, date]
            );
            plan = result.rows[0];
        }
        const taches = await pool.query('SELECT * FROM tache WHERE id_plan = $1 ORDER BY id', [plan.id]);
        const crenaux = await pool.query('SELECT * FROM crenaux WHERE plan_id = $1 ORDER BY heure', [plan.id]);
        const repas = await pool.query('SELECT * FROM repas WHERE plan_id = $1', [plan.id]);
        const eau = await pool.query('SELECT * FROM suivi_eau WHERE id_plan = $1', [plan.id]);

        res.json({
            plan,
            taches: taches.rows,
            crenaux: crenaux.rows,
            repas: repas.rows[0] || null,
            eau: eau.rows[0] || null,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message});
        }
    });
    
    module.exports = router; // Exporter le routeur pour l'utiliser dans index.js
