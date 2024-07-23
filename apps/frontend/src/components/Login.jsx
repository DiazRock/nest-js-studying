// src/components/Login.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { Form, Button } from 'semantic-ui-react';
import { useForm } from 'react-hook-form';
import { loginUser } from '../services/apiService';
import { storeLoginInfo } from '../store/loginSlice';

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const onSubmit = async (data, e) => {
    e.preventDefault();
    try {
      const response = await loginUser(data);
      dispatch(storeLoginInfo(response.data));
      window.location.href ='/'; // Redirect to home page after successful login
    } catch (error) {
      alert('Login failed');
      console.error(error);
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
              {required: true}
            )}
          />
      </Form.Field>
      {errors.password && <p>Enter an existing username in the plattform</p>}
      <Form.Field>
          <input
            placeholder='Password'
            type='password'
            {...register('password',
              {required: true}
            )}
          />
        </Form.Field>
        {errors.password && <p>Enter a Password</p>}
      <Button type="submit">Login</Button>
    </Form>
  );
};

export default Login;
