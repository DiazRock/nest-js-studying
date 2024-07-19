import React from 'react';
import { Button } from 'semantic-ui-react';
import { logoutUser } from '../services/apiService';

const LogOut = () => {

    console.log('Log Out component');
    const onSubmit = (event) => {
        event.preventDefault();
        logoutUser();
        alert('Logged out successfully!');
        window.location.href = "/";  // Redirect to the login page after logout
    }
    return (
        <Button onClick={onSubmit}>
            Log out
        </Button>
    )
}

export default LogOut;