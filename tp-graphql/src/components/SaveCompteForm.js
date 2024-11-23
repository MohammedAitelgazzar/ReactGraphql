import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';  // Importer useNavigate de React Router
import { SAVE_COMPTE } from '../queries';
import './SaveCompteForm.css';  // Importez le CSS ici

const SaveCompteForm = ({ onCompteCreated }) => {  // Ajouter prop pour la fonction de mise à jour des comptes
  const [solde, setSolde] = useState('');
  const [type, setType] = useState('COURANT');
  const [error, setError] = useState('');
  const navigate = useNavigate();  // Déclarez le hook useNavigate

  const [saveCompte, { data, loading, error: mutationError }] = useMutation(SAVE_COMPTE);

  // Validation stricte des données
  const validateForm = () => {
    if (isNaN(solde) || solde <= 0) {
      setError('Le solde doit être un nombre positif.');
      return false;
    }
    if (!['COURANT', 'EPARGNE'].includes(type)) {
      setError('Type de compte invalide.');
      return false;
    }
    setError('');  // Réinitialise l'erreur si les données sont valides
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Vérifier les validations avant de soumettre
    if (!validateForm()) {
      return;
    }

    try {
      const response = await saveCompte({
        variables: {
          compte: {
            solde: parseFloat(solde),
            type
          }
        }
      });

      // Après l'enregistrement, rediriger vers la page de liste des comptes
      if (response.data) {
        // Appeler la fonction de parent pour ajouter le compte
        onCompteCreated(response.data.saveCompte);

        // Rediriger vers la page de liste des comptes
        navigate('/comptes');  // Remplacez '/comptes' par l'URL de votre liste des comptes
      }

    } catch (err) {
      console.error("Erreur lors de l'enregistrement du compte : ", err);
    }
  };

  if (loading) return <p>Enregistrement en cours...</p>;
  if (mutationError) return <p className="error">Erreur: {mutationError.message}</p>;

  return (
    <div>
      <h2>Créer un Compte</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Solde</label>
          <input
            type="number"
            value={solde}
            onChange={(e) => setSolde(e.target.value)}
            required
            min="0"  // Solde doit être positif
            step="any" // Permet les décimales
          />
        </div>

        <div>
          <label>Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} required>
            <option value="COURANT">Courant</option>
            <option value="EPARGNE">Épargne</option>
          </select>
        </div>

        <button type="submit">Enregistrer le compte</button>

        {/* Affichage de l'erreur de validation */}
        {error && <p className="error">{error}</p>}
      </form>

      {data && <p className="success">Compte créé avec ID: {data.saveCompte.id}</p>}
    </div>
  );
};

export default SaveCompteForm;
