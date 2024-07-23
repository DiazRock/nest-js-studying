import React from 'react';
import { Button } from 'semantic-ui-react';
import { useDispatch } from 'react-redux';
import { LogOutUser } from '../store/loginSlice';


const LogOut = () => {
    const dispatch = useDispatch();
    console.log('Log Out component');
    const onSubmit = (event) => {
        event.preventDefault();
        dispatch(LogOutUser());
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