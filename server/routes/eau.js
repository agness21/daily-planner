const express = require('express');
const pool = require('../db'); // Importer le pool de connexion à la base de données
const authToken = require('../middleware/authToken'); // Importer le middleware d'authentification

const router = express.Router(); // Créer un routeur pour gérer les routes des plans

//enregistrer nombre de verres d'eau

router.put('/', authToken, async (req, res) => {
    const {plan_id, nb_verres} = req.body; // Récupérer les données de la requête
    if (!plan_id || nb_verres === undefined || nb_verres === null || nb_verres < 0 || nb_verres > 10) {
        return res.status(400).json({ error: 'plan_id et nb_verres requis' }); // Vérifier que les données sont présentes
    }
    try {
        //verifier que le planning appartient au user
        const plan = await pool.query('SELECT * FROM daily_plan WHERE id = $1 AND user_id = $2',
            [plan_id, req.userId]);
        if (plan.rows.length === 0) {
            return res.status(404).json({ error: 'Planning introuvable' });
        }

        //maj de la ligne si elle existe sinon la créer
        
        let result = await pool.query(
            'UPDATE suivi_eau SET nb_verres = $1 WHERE id_plan = $2 RETURNING *',
            [nb_verres, plan_id]);
        if (result.rows.length === 0) {
            result = await pool.query(
                'INSERT INTO suivi_eau (id_plan, nb_verres) VALUES ($1, $2) RETURNING *',
                [plan_id, nb_verres]
            );
        }
        res.json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router; // Exporter le routeur pour l'utiliser dans l'application principale
