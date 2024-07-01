// src/components/CreateUser.js
import React, { useState } from 'react';
import { createUser } from '../services/apiService';
import '../styles/Form.css';

const CreateUser = () => {
  const [username, setUsername] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUser({ username });
      alert('User created successfully!');
    } catch (error) {
      alert('Failed to create user');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create User</h2>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
      <button type="submit">Create User</button>
    </form>
  );
};

export default CreateUser;
