import { useEffect, useState } from "react";

const API = 'http://localhost:5000/api';

const HUMEURS = ['Excellent', 'Bien', 'Normal', 'Pas bien', 'Mal'];

export default function Plan({ token , onLogout }) {
    const date = new Date().toLocaleDateString('en-CA'); // Format de date AAAA-MM-JJ
    const [plan, setPlan] = useState(null);
    const [taches, setTaches] = useState([]);
    const [titre, setTitre] = useState('');
    const [verres, setVerres] = useState(0);
    const [humeur, setHumeur] = useState(null);

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
                setVerres(data.eau ? data.eau.nb_verres : 0);
                setHumeur(data.plan.humeur);
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
    };

    //gestion de l'eau
    async function majEau(n) {
        //avec clique sur un verre
        const nouveau = n === verres ? n-1 : n;
        
        setVerres(nouveau);
        await fetch(`${API}/eau`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({ plan_id : plan.id, nb_verres: nouveau }),
        });
    }

    //gestion de l'humeur
    async function majHumeur(valeur) {
        const nouvelle = valeur === humeur ? null : valeur;
        setHumeur(nouvelle);
        await fetch(`${API}/humeur`, {
            method: 'PUT',
            headers,
            body: JSON.stringify({ plan_id : plan.id, humeur: nouvelle }),
        });
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

    <h2>Suivi de l'eau</h2>
    <div>
        {Array.from({ length: 8 }, (_, i) => (
            <button key={i} onClick={() => majEau(i + 1)}
                style={{ 
                    width: 32,
                    height: 40,
                    marginRight: 6,
                    cursor: 'pointer',
                    border: '1.5px solid #4A5A2A',
                    background: i < verres ? '#4A5A2A' : 'transparent',
        }}
    />
    ))}
    </div>
    <p>{verres} / 8 verres</p>


    <h2>Humeur</h2>
    <div>
    {HUMEURS.map((h) => (
        <button
            key={h}
            onClick={() => majHumeur(h)}
            style={{
                marginRight: 6,
                padding: '8px 12px',
                cursor: 'pointer',
                border: '1.5px solid #4A5A2A',
                background: humeur === h ? '#4A5A2A' : 'transparent',
                color: humeur === h ? '#fff' : 'inherit',
            }}
        >
            {h}
        </button>
    ))}
    </div>
    <p><button onClick={onLogout}>Déconnexion</button></p>
    </div>
    );
}