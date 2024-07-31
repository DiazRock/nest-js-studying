// src/components/Register.jsx
import React from 'react';
import { Form, Button } from 'semantic-ui-react';
import { useForm } from 'react-hook-form';
import { storeLoginInfo } from '../store/loginSlice';
import { useDispatch } from'react-redux';
import { registerUser } from '../services/apiService';
import { loginUser } from '../services/apiService';
import { useSelector } from 'react-redux';
import { errorMessage } from '../styles';


const Register = ({Header}) => {
  const userRole = useSelector((state) => state.loginReducer.userRole);
  const dispatch = useDispatch();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({displayname, username, email, password, balance}, e) => {
    e.preventDefault();
    try {
      const crateUserInfo = {displayname, username, email, password, balance};
      await registerUser(crateUserInfo);
      if (userRole === 'admin') {
        alert('User created successfully!');
      }
      else {
        alert('Registration successful with default amount 500');
        const response = await loginUser({username, password});
        dispatch(storeLoginInfo(response.data));
        
        window.location.href ='/'; // Redirect to home page after successful login
      }
    } catch (error) {
      if (userRole === 'admin') {
        alert('User creation failed!');
      }
      else {
        alert('Registration failed');
      }
    }
  };

  return (
    <div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <h2>{Header}</h2>
        <Form.Field>
          <input
            placeholder='User Name'
            type='text'
            {...register('username', { required: true, maxLength: 10 })}
          />
        </Form.Field>
        {errors.username && <p style={errorMessage}>Please check the User Name</p>}
        <Form.Field>
          <input
            placeholder='Display name (Optional)'
            type='text'
            {...register('displayname', { maxLength: 10 })}
          />
        </Form.Field>
        {errors.displayname && <p style={errorMessage}>Please check the Display Name</p>}
        <Form.Field>
          <input
            placeholder='Email'
            type='email'
            {...register('email', {
              required: true,
              pattern:
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
          />
        </Form.Field>
        {errors.email && <p style={errorMessage}>Please check the Email</p>}
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
        {errors.password && <p style={errorMessage}>Please check the Password</p>}

        <Form.Field>
          <input
          placeholder='Confirm Password'
          type='password'
          {...register("confirm_password", {
            required: true,
            validate: (val) => {
              if (watch('password') !== val) {
                return "Your passwords do no match";
              }
            },
          })}
          />
        </Form.Field>
        {errors.confirm_password && <p style={errorMessage}>Password must match</p>}
        <Form.Field>
          {userRole === 'admin' &&
          <input
          id = "balance_quantity"
          placeholder='Add balance'
          type='number'
          min = "1"
          max = "100000"
          {...register("balance")}
          />}
        </Form.Field>
        <Button type='submit'>Submit</Button>
      </Form>
    </div>
  );
};

export default Register;
