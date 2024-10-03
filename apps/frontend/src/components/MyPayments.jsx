// src/components/ListPayments.js
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { listPaymentsByUser } from '../services/apiService';
import '../styles/List.css';

const MyPayments = () => {
  const [payments, setPayments] = useState([]);
  const userId = useSelector((state) => state.loginReducer.userId);
  const jwtToken = useSelector((state) => state.loginReducer.jwtSession);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await listPaymentsByUser(userId, jwtToken);
        setPayments(response.data);
      } catch (error) {
        alert(`Failed to fetch payments. ${error}`);
      }
    };

    fetchPayments();
  }, [userId, jwtToken]);

  return (
    <div>
      <h2>My Payments</h2>
      {payments.length === 0 &&
      <h3>No payments for the current logged user</h3>}

      <table className="user-table">
        <thead>
          <tr>
            <th>Label</th>
            <th>Amount</th>
            <th>Date Of Creation</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td>{payment.label}</td>
              <td>${payment.amount}</td>
              <td>${payment.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyPayments;
