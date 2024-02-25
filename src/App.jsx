import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [transactionType, setTransactionType] = useState("income");
  const [transactionAmount, setTransactionAmount] = useState(0);

  const [priceWithoutVAT, setPriceWithoutVAT] = useState(0);
  const [vatRate, setVATRate] = useState(21);
  const [vatResult, setVATResult] = useState(0);

  const [baseCurrency, setBaseCurrency] = useState('CZK');
  const [targetCurrency, setTargetCurrency] = useState('USD');
  const [amount, setAmount] = useState(0);
  const [conversionResult, setConversionResult] = useState(0);

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  const addTransaction = () => {
    const newTransaction = {
      type: transactionType,
      amount: parseFloat(transactionAmount)
    };
    setTransactions([...transactions, newTransaction]);
    setTransactionAmount(0);
  };

  const calculateTotalPrice = () => {
    const totalPrice = priceWithoutVAT * (1 + vatRate / 100);
    setVATResult(totalPrice);
  };

  const convertCurrency = () => {
    let result = 0;
    if (baseCurrency === 'CZK' && targetCurrency === 'USD') {
      result = amount * 0.045;
    } else if (baseCurrency === 'CZK' && targetCurrency === 'EUR') {
      result = amount * 0.038;
    } else if (baseCurrency === 'USD' && targetCurrency === 'CZK') {
      result = amount * 22.5;
    } else if (baseCurrency === 'EUR' && targetCurrency === 'CZK') {
      result = amount * 26.3;
    }
    setConversionResult(result);
  };

  const filterTransactionsByPrice = () => {
    const filteredTransactions = transactions.filter(transaction => {
      return transaction.amount >= minPrice && transaction.amount <= maxPrice;
    });
    setTransactions(filteredTransactions);
  };

  const sortTransactionsByPrice = (order) => {
    const sortedTransactions = transactions.slice().sort((a, b) => {
      return order === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    });
    setTransactions(sortedTransactions);
  };

  return (
    <div className="app">
      <h1>Správce Financí</h1>

      <div className="transactions">
        <div className="transaction-group">
          <h2>Příjmy a výdaje</h2>
          <div className="transaction-form">
            <select value={transactionType} onChange={(e) => setTransactionType(e.target.value)}>
              <option value="income">Příjem</option>
              <option value="expense">Výdaj</option>
            </select>
            <input type="number" value={transactionAmount} onChange={(e) => setTransactionAmount(e.target.value)} />
            <button onClick={addTransaction}>Přidat</button>
          </div>
          <div className="transaction-list">
            <h3>Seznam transakcí</h3>
            <button className='sort-button' onClick={() => sortTransactionsByPrice('desc')}>Seřadit podle nejvyšší ceny</button>
            <button className='sort-button' onClick={() => sortTransactionsByPrice('asc')}>Seřadit podle nejnižší ceny</button>
            <ul>
              {transactions.map((transaction, index) => (
                <li key={index}>
                  {transaction.type === 'income' ? 'Příjem' : 'Výdaj'}: {transaction.amount}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="vat-calculator">
          <h2>Výpočet DPH</h2>
          <div>
            <input className='dph' type="number" value={priceWithoutVAT} onChange={(e) => setPriceWithoutVAT(e.target.value)} />
            <input className='dph' type="number" value={vatRate} onChange={(e) => setVATRate(e.target.value)} />
            <button className='spocitat' onClick={calculateTotalPrice}>Spočítat</button>
          </div>
          <div className="vat-result">
            <h3>Výsledek výpočtu DPH</h3>
            <p>Cena s DPH: {vatResult}</p>
          </div>
        </div>
      </div>

      <div className="currency-converter">
        <h2>Převod měn</h2>
        <div>
          <select value={baseCurrency} onChange={(e) => setBaseCurrency(e.target.value)}>
            <option value="CZK">CZK</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <select value={targetCurrency} onChange={(e) => setTargetCurrency(e.target.value)}>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="CZK">CZK</option>
          </select>
          <button onClick={convertCurrency}>Převést</button>
        </div>
        <div className="conversion-result">
          <h3>Převedená částka: {conversionResult} {targetCurrency}</h3>
        </div>
      </div>
    </div>
  );
};

export default App;
