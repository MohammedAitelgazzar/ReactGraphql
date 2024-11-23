import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_COMPTES, DELETE_COMPTE, ADD_TRANSACTION, TOTAL_SOLDE } from '../queries';  // Importez votre requête pour le total des soldes
import './ComptesList.css';  // Importation du fichier CSS

const ComptesList = () => {
  const { loading: comptesLoading, error: comptesError, data: comptesData } = useQuery(GET_COMPTES);
  const { loading: soldeLoading, error: soldeError, data: soldeData } = useQuery(TOTAL_SOLDE);  // Utilisez la requête pour le total des soldes
  
  const [deleteCompte] = useMutation(DELETE_COMPTE, {
    refetchQueries: [{ query: GET_COMPTES }], // Refait la requête GET_COMPTES après la suppression pour mettre à jour la liste
  });
  
  const [addTransaction] = useMutation(ADD_TRANSACTION);

  const [montant, setMontant] = useState('');
  const [typeTransaction, setTypeTransaction] = useState('DEPOT');
  const [compteId, setCompteId] = useState('');

  if (comptesLoading || soldeLoading) return <p>Loading...</p>;
  if (comptesError || soldeError) return <p>Error: {comptesError?.message || soldeError?.message}</p>;

  const handleDelete = (compteId) => {
    deleteCompte({
      variables: { id: compteId },
      update: (cache) => {
        const existingComptes = cache.readQuery({ query: GET_COMPTES });
        const newComptes = existingComptes.allComptes.filter(compte => compte.id !== compteId);
        cache.writeQuery({
          query: GET_COMPTES,
          data: { allComptes: newComptes },
        });
      },
    });
  };

  const handleAddTransaction = () => {
    addTransaction({
      variables: {
        transactionRequest: {
          montant: parseFloat(montant),
          type: typeTransaction,
          compteId: parseInt(compteId),
        },
      },
      onCompleted: () => {
        alert('Transaction ajoutée avec succès!');
        setMontant('');
        setTypeTransaction('DEPOT');
        setCompteId('');
      },
      onError: (err) => {
        alert('Erreur lors de l\'ajout de la transaction: ' + err.message);
      },
    });
  };

  return (
    <div className="comptes-list-container">
      <h2 className="comptes-title">Liste des Comptes</h2>

      {soldeData && (
        <div className="solde-total">
          <p>Total des Soldes:</p>
          <p>Nombre total de comptes: {soldeData.totalSolde.count}</p>
          <p>Somme des soldes: {soldeData.totalSolde.sum}</p>
          <p>Moyenne des soldes: {soldeData.totalSolde.average}</p>
        </div>
      )}

      <table className="comptes-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Solde</th>
            <th>Date de Création</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {comptesData.allComptes.map((compte) => (
            <tr key={compte.id}>
              <td>{compte.id}</td>
              <td>{compte.solde}</td>
              <td>{compte.dateCreation}</td>
              <td>{compte.type}</td>
              <td>
                <button onClick={() => handleDelete(compte.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="transaction-form">
        <h3>Ajouter une transaction</h3>
        <div>
          <label>Montant</label>
          <input
            type="number"
            value={montant}
            onChange={(e) => setMontant(e.target.value)}
          />
        </div>
        <div>
          <label>Type de Transaction</label>
          <select
            value={typeTransaction}
            onChange={(e) => setTypeTransaction(e.target.value)}
          >
            <option value="DEPOT">Dépôt</option>
            <option value="RETRAIT">Retrait</option>
          </select>
        </div>
        <div>
          <label>Compte ID</label>
          <input
            type="number"
            value={compteId}
            onChange={(e) => setCompteId(e.target.value)}
          />
        </div>
        <button onClick={handleAddTransaction}>Créer Transaction</button>
      </div>
    </div>
  );
};

export default ComptesList;
