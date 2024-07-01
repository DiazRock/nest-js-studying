// src/Payment.js

import React, { useState } from 'react';
import { makePayment } from './service_communication/api_service';

const Payment = () => {
    const [userId, setUserId] = useState('');
    const [amount, setAmount] = useState('');
    const [transactionId, setTransactionId] = useState(null);
    const [error, setError] = useState('');

    const handleMakePayment = async () => {
        try {
            const payment = await makePayment({ userId, amount });
            setTransactionId(payment.transactionId);
            setError('');
        } catch (error) {
            setError('Error making payment');
        }
    };

    return (
        <div>
            <h2>Make Payment</h2>
            <input
                type="text"
                placeholder="User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
            />
            <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />
            <button onClick={handleMakePayment}>Make Payment</button>
            {transactionId && <p>Transaction ID: {transactionId}</p>}
            {error && <p>{error}</p>}
        </div>
    );
};

export default Payment;
