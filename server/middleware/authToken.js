const jwt = require('jsonwebtoken'); // Importer le module jsonwebtoken pour gérer les tokens JWT

module.exports = (req, res, next) => {
    const header = req.headers.authorization; // Récupérer le token JWT depuis l'en-tête Authorization
    if (!header) {
        return res.status(401).json({ error: 'Non connecté' }); // Si le token est manquant, renvoyer une erreur 401
    }
    const token = header.split(' ')[1]; // Extraire le token de l'en-tête (format "Bearer <token>")
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Vérifier et décoder le token en utilisant la clé secrète
        req.userId = decoded.id; // Ajouter l'ID de l'utilisateur décodé à l'objet req pour une utilisation ultérieure
        next(); // Passer au middleware suivant
    }
    catch (err) {
        return res.status(401).json({ error: 'Token invalide' }); // Si le token est invalide, renvoyer une erreur 401
    }
};