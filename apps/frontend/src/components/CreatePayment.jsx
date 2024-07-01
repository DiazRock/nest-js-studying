// src/components/CreatePayment.js
import React, { useState } from 'react';
import { createPayment } from '../services/apiService';
import '../styles/Form.css';

const CreatePayment = () => {
  const [userId, setUserId] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPayment({ amount: amount, userId: userId  });
      alert('Payment created successfully!');
    } catch (error) {
      alert('Failed to create payment');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Payment</h2>
      <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="User ID" />
      <input type="text" value={amount} onChange={(e) => setAmount(Number(e.target.value))} placeholder="Amount" />
      <button type="submit">Create Payment</button>
    </form>
  );
};

export default CreatePayment;
