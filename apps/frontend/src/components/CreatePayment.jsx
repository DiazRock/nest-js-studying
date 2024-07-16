// src/components/CreatePayment.js
import React, { useState } from 'react';
import { createPayment } from '../services/apiService';
import { Form } from './Form';
import { Input } from './Input';
import '../styles/Form.css';
import { num_validation, name_validation } from '../utils/inputValidations';

const CreatePayment = () => {
  const [userId, setUserId] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e, {amount, userId}) => {
    e.preventDefault()
    try {
      await createPayment({ amount, userId  });
      return true;
    } catch (error) {
      console.error('Failed to create payment', error);
      return false
    }
  };

  return (
    <Form
          submitCallBack={handleSubmit}
          successText="Payment created successfully"
          listOfInputs={ [num_validation, name_validation] }
    />
      /* <h2>Create Payment</h2>
      <Input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="User ID" />
      <Input type="text" value={amount} onChange={(e) => setAmount(Number(e.target.value))} placeholder="Amount" />
      <button type="submit">Create Payment</button> */
    
  );
};

export default CreatePayment;
