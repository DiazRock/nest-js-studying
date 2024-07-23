// src/components/ListUsers.js
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { listUsers } from '../services/apiService';
import '../styles/List.css';

const ListUsers = () => {
  const jwtToken = useSelector((state) => state.loginReducer.jwtSession);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await listUsers(jwtToken);
        setUsers(response.data);
      } catch (error) {
        alert('Failed to fetch users');
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Users</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>UserId</th>
            <th>Username</th>
            <th>Email</th>
            <th>Payments</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <select className="payment-select">
                  {user.payments && user.payments.length > 0 ? (
                    user.payments.map((payment) => (
                      <option key={payment.id} value={payment.id}>
                        ${payment.amount}
                      </option>
                    ))
                  ) : (
                    <option value="no-payments">No payments</option>
                  )}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListUsers;
