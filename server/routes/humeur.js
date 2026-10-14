const express = require('express');
const pool = require('../db'); // Importer le pool de connexion à la base de données
const authToken = require('../middleware/authToken'); // Importer le middleware d'authentification

const router = express.Router(); // Créer un routeur pour gérer les routes des plans

const HUMEURS =['Excelent', 'Bien', 'Normal', 'Pas bien', 'Mal'];

//enregistrer l'humeur

router.put('/', authToken, async (req, res) => {
    const {plan_id, humeur} = req.body; // Récupérer les données de la requête
    if (!plan_id || (humeur !== null && !HUMEURS.includes(humeur))) {
        return res.status(400).json({ error: 'plan_id et humeur requis' }); // Vérifier que les données sont présentes
    }
    try {
        const result = await pool.query(
            'UPDATE daily_plan SET humeur = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
            [humeur, plan_id, req.userId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Planning introuvable' });
        }
        res.json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router; // Exporter le routeur pour l'utiliser dans l'application principale