import React, { useState } from 'react';
import { ApolloProviderWrapper } from './client/ApolloClient';
import ComptesList from './components/ComptesList';
import SaveCompteForm from './components/SaveCompteForm'; // Importer le formulaire
import { BrowserRouter as Router } from 'react-router-dom'; // Importer le Router pour utiliser useNavigate
import './App.css'; // Si vous avez un fichier CSS global

function App() {
  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <ApolloProviderWrapper>
      <Router> {/* Envelopper l'application avec Router */}
        <div className="App">
          <h1>Gestion des Comptes</h1>
          <button onClick={toggleForm}>
            {showForm ? 'Annuler la création du compte' : 'Créer un Nouveau Compte'}
          </button>

          {showForm ? (
            <SaveCompteForm /> // Afficher le formulaire de création de compte
          ) : (
            <ComptesList /> // Afficher la liste des comptes
          )}
        </div>
      </Router>
    </ApolloProviderWrapper>
  );
}

export default App;
