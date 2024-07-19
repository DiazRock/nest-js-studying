// src/components/ListPayments.js
import React, { useEffect, useState } from 'react';
import { useParams} from 'react-router-dom';
import { listPaymentsByUser } from '../services/apiService';
import '../styles/List.css';

const MyPayments = () => {
  const [payments, setPayments] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        console.log("Listing the payments ");
        const response = await listPaymentsByUser(id);
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
      <h2>My Payments</h2>
      {payments.length === 0 &&
      <h3>No payments for the current logged user</h3>}

      <table className="user-table">
        <thead>
          <tr>
            <th>Payment ID</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td>{payment.id}</td>
              <td>${payment.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyPayments;
