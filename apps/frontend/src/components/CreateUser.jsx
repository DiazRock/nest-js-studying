// src/components/CreateUser.jsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { createUser } from '../services/apiService';
import '../styles/Form.css';

const CreateUser = () => {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const jwtToken = useSelector((state) => state.loginReducer.jwtSession);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUser({ username: username, displayName: displayName, email: email }, jwtToken);
      alert('User created successfully!');
    } catch (error) {
      alert('Failed to create user');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create User</h2>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
      <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Display Name" />
      <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <button type="submit">Create User</button>
    </form>
  );
};

export default CreateUser;
