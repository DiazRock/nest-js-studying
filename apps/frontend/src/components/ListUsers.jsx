// src/components/ListUsers.js
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { listUsers } from '../services/apiService';
import '../styles/List.css';

const ListUsers = () => {
  const [users, setUsers] = useState([]);
  const jwtToken = useSelector((state) => state.loginReducer.jwtSession);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await listUsers(jwtToken);
        console.log('Listing the users ', response);
        setUsers(response.data);
      } catch (error) {
        alert('Failed to fetch users');
      }
    };
    fetchUsers();
  }, [jwtToken]);

  return (
    <div>
      <h2>Users</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>balance</th>
            <th>Payments</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.balance}</td>
              <td>
                <select className="payment-select">
                  {user.payments && user.payments.length > 0 ? (
                    user.payments.map((payment) => (
                      <option key={payment.id} value={payment.id}>
                        {payment.label}
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
