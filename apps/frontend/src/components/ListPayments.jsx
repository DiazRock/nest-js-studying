// src/components/ListPayments.js
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { listPayments } from '../services/apiService';
import '../styles/List.css';

const ListPayments = () => {
  const [payments, setPayments] = useState([]);
  const jwtToken = useSelector((state) => state.loginReducer.jwtSession);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await listPayments(jwtToken);
        setPayments(response.data);
      } catch (error) {
        alert('Failed to fetch payments');
      }
    };
    fetchPayments();
  }, [jwtToken]);

  return (
    <div>
      <h2>Payments</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>Label</th>
            <th>Amount</th>
            <th>Created At</th>
            <th>Done by user</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td>{payment.label}</td>
              <td>${payment.amount}</td>
              <td>{payment.createdAt}</td>
              <td>{payment.user? payment.user.username: 'user null!' }</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListPayments;
