const express = require('express');
const pool = require('../db'); // Importer le pool de connexion à la base de données
const authToken = require('../middleware/authToken'); // Importer le middleware d'authentification

const router = express.Router(); // Créer un routeur pour gérer les routes des plans

//ajouter une tache

router.post('/', authToken, async (req, res) => {
    const{ plan_id, titre}= req.body; // Récupérer les données de la requête
    if (!plan_id || !titre) {
        return res.status(400).json({ error: 'plan_id et titre requis' }); // Vérifier que les données sont présentes
    }
    try {
        //verifier que le planning appartient au user

        const plan = await pool.query('SELECT * FROM daily_plan WHERE id = $1 AND user_id = $2', [plan_id, req.userId]);
        if(!plan.rows.length === 0) {
            return res.status(404).json({ error: 'Planning introuvable' }); }
        
        const result = await pool.query(
            'INSERT INTO taches (plan_id, titre) VALUES ($1, $2) RETURNING *',
            [plan_id, titre]
        );
        res.status(201).json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

//pour cocher et decocher une tache

router.patch('/:id', authToken, async (req, res) => {
    try {
        const result = await pool.query(
            'UPDATE taches SET terminee = NOT terminee WHERE id = $1 and id_plan IN (SELECT id FROM daily_plan WHERE user_id = $2) RETURNING *',
            [req.params.id, req.userId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Tâche introuvable' });
        }
        res.json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

//suppression d'une tache

router.delete('/:id', authToken, async (req, res) => {
    try {
        const result = await pool.query(
            'DELETE FROM taches WHERE id = $1 and id_plan IN (SELECT id FROM daily_plan WHERE user_id = $2) RETURNING *',
            [req.params.id, req.userId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Tâche introuvable' });
        }
        res.json({supprimee: result.rows[0].id});
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router; // Exporter le routeur pour l'utiliser dans index.js