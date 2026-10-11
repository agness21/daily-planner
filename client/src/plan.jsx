import { useEffect, useState } from "react";

const API = 'http://localhost:5000/api';

export default function Plan({ token , onLogout }) {
    const date = new Date().toLocaleDateString('en-CA'); // Format de date AAAA-MM-JJ
    const [plan, setPlan] = useState(null);
    const [taches, setTaches] = useState([]);
    const [titre, setTitre] = useState('');

    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` // Ajouter le token JWT dans l'en-tête Authorization
    };

    //recup du planning du jour

    useEffect(() => {
        fetch(`${API}/plans/${date}`, { headers })
            .then(res => res.json())
            .then(data => {
                if (data.error) return onLogout(); // Si le token est invalide, déconnecter l'utilisateur
                setPlan(data.plan);
                setTaches(data.taches);
            });
    }, []);

    async function ajouterTache() {
        if (!titre.trim()) return; // Ne pas ajouter une tâche vide
        const res = await fetch(`${API}/taches`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ plan_id : plan.id, titre }),
        });
        const nouvelleTache = await res.json();
        setTaches([...taches, nouvelleTache]);
        setTitre(''); // Réinitialiser le champ de saisie
    }

    async function cocherTache (id){
        const res = await fetch(`${API}/taches/${id}`, {
            method: 'PATCH',
            headers,});
        const majTache = await res.json();
        setTaches(taches.map((t) => (t.id === id ? majTache : t))); // Mettre à jour la tâche cochée dans l'état
    };

    async function supprimerTache(id) {
        const res = await fetch(`${API}/taches/${id}`, {
            method: 'DELETE',
            headers,
        });
        setTaches(taches.filter((t) => t.id !== id)); // Supprimer la tâche de l'état
    }

    return (
          <div style={{ padding: 40, maxWidth: 480 }}>
      <h1>Daily Planner</h1>
      <p>{date}</p>

      <h2>Tâches du jour</h2>
      {taches.map((t) => (
        <div key={t.id}>
          <input type="checkbox" checked={t.terminee} onChange={() => cocherTache(t.id)} />
          <span style={{ textDecoration: t.terminee ? 'line-through' : 'none' }}>
            {' '}{t.titre}{' '}
          </span>
          <button onClick={() => supprimerTache(t.id)}>Supprimer</button>
        </div>
      ))}

      <input
        placeholder="Nouvelle tâche"
        value={titre}
        onChange={(e) => setTitre(e.target.value)}
      />
      <button onClick={ajouterTache}>Ajouter</button>

      <p><button onClick={onLogout}>Déconnexion</button></p>
    </div>
  );
}