// src/queries.js
import { gql } from '@apollo/client';

export const GET_COMPTES = gql`
  query {
    allComptes {
      id
      solde
      dateCreation
      type
    }
  }
`;
export const SAVE_COMPTE = gql`
  mutation SaveCompte($compte: CompteRequest!) {
    saveCompte(compte: $compte) {
      id
      solde
      dateCreation
      type
    }
  }
`;
export const DELETE_COMPTE = gql`
  mutation deleteCompteById($id: ID!) {
    deleteCompteById(id: $id)
  }
`;

export const ADD_TRANSACTION = gql`
  mutation AddTransaction($transactionRequest: TransactionRequest) {
    addTransaction(transactionRequest: $transactionRequest) {
      id
      montant
      dateTransaction
      type
      compte {
        id
      }
    }
  }
`;

export const TOTAL_SOLDE = gql`
  query TotalSolde {
    totalSolde {
      sum
      count
      average
    }
  }
`;