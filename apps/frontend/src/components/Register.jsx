// src/components/Register.jsx
import React, { useState } from 'react';
import { Form, Button } from 'semantic-ui-react';
import { useForm } from 'react-hook-form';
import { registerUser } from '../services/apiService';
import { loginUser } from '../services/apiService';

const Register = () => {

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({displayname, username, email, password}, e) => {
    e.preventDefault();
    try {
      const crateUserInfo = {displayname, username, email, password}
      await registerUser(crateUserInfo);
      alert('Registration successful!');
      await loginUser({username, password});
      window.location.href ='/'; // Redirect to home page after successful login
    } catch (error) {
      alert('Registration failed');
    }
  };

  return (
    <div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <h2>Register</h2>
        <Form.Field>
          <input
            placeholder='User Name'
            type='text'
            {...register('username', { required: true, maxLength: 10 })}
          />
        </Form.Field>
        {errors.username && <p>Please check the User Name</p>}
        <Form.Field>
          <input
            placeholder='Display name (Optional)'
            type='text'
            {...register('displayname', { maxLength: 10 })}
          />
        </Form.Field>
        {errors.displayname && <p>Please check the Display Name</p>}
        <Form.Field>
          <input
            placeholder='Email'
            type='email'
            {...register('email', {
              required: true,
              pattern:
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
          />
        </Form.Field>
        {errors.email && <p>Please check the Email</p>}
        <Form.Field>
          <input
            placeholder='Password'
            type='password'
            {...register('password', {
              required: true,
              pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/,
            })}
          />
        </Form.Field>
        {errors.password && <p>Please check the Password</p>}

        <Form.Field>
          <input
          placeholder='Confirm Password'
          type='password'
          {...register("confirm_password", {
            required: true,
            validate: (val) => {
              if (watch('password') != val) {
                return "Your passwords do no match";
              }
            },
          })}
          />
        </Form.Field>
        {errors.confirm_password && <p>Password must match</p>}
        <Button type='submit'>Submit</Button>
      </Form>
    </div>
  );
};

export default Register;
