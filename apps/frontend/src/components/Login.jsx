// src/components/Login.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Form, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { loginUser } from '../services/apiService';
import { storeLoginInfo } from '../store/loginSlice';
import { errorMessage } from '../styles'; 

const Login = () => {
  const [userNotFound, setUserNotFound] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const onSubmit = async (data, e) => {
    e.preventDefault();
    setUserNotFound(false);
    try {
      const response = await loginUser(data);
      console.log('Logged in successfully', response);
      if (response.status === 201) { // Assuming 200 is success status
        dispatch(storeLoginInfo(response.data));
        window.location.href = '/'; // Redirect to home page after successful login
      }
    } catch (error) {
      
      if (error.response && error.response.status === 404) {
        // Assuming 404 status is returned when user is not found
        setUserNotFound(true);
      } else {
        alert('Login failed');
        console.error(error);
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <h2>Login</h2>
      <Form.Field>
      <input
            placeholder='User Name'
            type='text'
            {...register('username',
              {
                required: "Enter an existing username in the plattform",
              },
            )
          }
          />
      </Form.Field>
      {errors.username && <p style={errorMessage}>{errors.username.message}</p>}
      <Form.Field>
          <input
            placeholder='Password'
            type='password'
            {...register('password',
              {
                required: "Enter a Password"
              }
            )}
          />
        </Form.Field>
        {errors.password && <p style={errorMessage}>{errors.password.message}</p>}
        
        {userNotFound && (
          <p style={errorMessage}>
            User not found. <Link to="/register">Register here</Link>
          </p>
        )}

      <Button type="submit">Login</Button>
    </Form>
  );
};

export default Login;
