import { useState} from 'react';

import Plan from './plan.jsx';


const API = 'http://localhost:5000/api';

export default function App(){
  const [email, setEmail] = useState('');
  const [motPasse, setMotPasse] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token'));

  async function envoyer(route) {
    try {
      const res = await fetch(`${API}/auth/${route}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, motPasse })
      });
      const data = await res.json();
      if (!res.ok) return setMessage(data.error);

      if (route === 'login') {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setMessage('');
      }
      else {
        setMessage('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
      }
    }
    catch (err) {
      setMessage('Le serveur est indisponible.');
    }
  }

  function deconnecter() {
    localStorage.removeItem('token');
    setToken(null); 
  }
  
  if (token) {
    return <Plan token={token} onLogout={deconnecter} />;
  }

  return (
    <div style={{ padding: 40, maxWidth: 320 }}>
      <h1>Daily Planner</h1>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: 'block', width: '100%', marginBottom: 10 }}
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={motPasse}
        onChange={(e) => setMotPasse(e.target.value)}
        style={{ display: 'block', width: '100%', marginBottom: 10 }}
      />
      <button onClick={() => envoyer('login')}>Se connecter</button>{' '}
      <button onClick={() => envoyer('register')}>Créer un compte</button>
      <p>{message}</p>
    </div>
  );
}