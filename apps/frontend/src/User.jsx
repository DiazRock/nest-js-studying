// src/User.js

import React, { useState } from 'react';
import { createUser } from './service_communication/api_service';

const User = () => {
    const [username, setName] = useState('');
    const [email, setEmail] = useState('');
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState('');

    const handleCreateUser = async () => {
        try {
            console.log("Handeling the user to be created")
            const user = await createUser({ username, email });
            setUserId(user.id);
            setError('');
        } catch (error) {
            setError('Error creating user');
        }
    };

    return (
        <div>
            <h2>Create User</h2>
            <input
                type="text"
                placeholder="Name"
                value={username}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleCreateUser}>Create User</button>
            {userId && <p>User ID: {userId}</p>}
            {error && <p>{error}</p>}
        </div>
    );
};

export default User;
