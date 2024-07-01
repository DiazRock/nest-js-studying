// src/components/ListPayments.js
import React, { useEffect, useState } from 'react';
import { listPayments } from '../services/apiService';
import '../styles/List.css';

const ListPayments = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        console.log("Listing the payments ");
        const response = await listPayments();
        console.log("The response ", response);
        setPayments(response.data);
      } catch (error) {
        alert('Failed to fetch payments');
      }
    };

    fetchPayments();
  }, []);

  return (
    <div>
      <h2>Payments</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>Payment ID</th>
            <th>Amount</th>
            <th>User Name</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td>{payment.id}</td>
              <td>${payment.amount}</td>
              <td>{payment.user.username}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListPayments;
