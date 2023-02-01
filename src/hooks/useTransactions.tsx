import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';

interface Transaction {
  id: number
  title: string
  amount: number
  type: string
  category: string
  createdAt: string
}

type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>; //Omita os seguintes dados da interface Transaction

// type TransactionInput = Pick<Transaction, 'title' | 'amount' | 'type'| 'category'>; // Pega os seguintes dados da interface Transaction

interface TransactionsProviderProps {
  children: ReactNode;
}

interface TransactionsContextData { // Definir oq o contexto pode receber de parametro
  transactions: Transaction[];
  createTransaction: (transaction: TransactionInput) => Promise<void>
}

const TransactionsContext = createContext<TransactionsContextData>(
  {} as TransactionsContextData // Serve para corrigir o erro que dá para indicar q o objeto inicial atende ao parametro
);

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  
  useEffect(() => {
    api
      .get('transactions')
      .then((response) => setTransactions(response.data.transactions))
  }, []);

  async function createTransaction(transactionInput: TransactionInput) {
    const response = await api.post('/transactions', {
      ...transactionInput,
      createdAt: new Date(),
    });
    const { transaction } = response.data
    setTransactions([
      ...transactions,
      transaction,
    ])
  }

  return(
    <TransactionsContext.Provider value={{ transactions, createTransaction }}>
      {children}
    </TransactionsContext.Provider>
  )
}

export function useTransactions() {
  const context = useContext(TransactionsContext);

  return context
}