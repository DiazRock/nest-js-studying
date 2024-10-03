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
            {...register('username', 
              {
                required: 'Username is required',
                maxLength: {
                  value: 10,
                  message: 'Username cannot exceed 10 characters',
                },
              }
            )}
          />
          {errors.username && <p style={errorMessage}>{errors.username.message}</p>}
        </Form.Field>
        <Form.Field>
          <input
            placeholder='Display name (Optional)'
            type='text'
            {...register('displayname', { 
                maxLength: {
                    value: 10,
                    message: 'Display name cannot exceed 10 characters',
                  } 
              })}
          />
          {errors.displayname && <p style={errorMessage}>{errors.displayname.message}</p>}
        </Form.Field>
        {errors.displayname && <p style={errorMessage}>Please check the Display Name</p>}
        <Form.Field>
          <input
            placeholder='Email'
            type='email'
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: 'Please enter a valid email address',
              },
            })}
          />
          {errors.email && <p style={errorMessage}>{errors.email.message}</p>}
        </Form.Field>
        <Form.Field>
          <input
            placeholder='Password'
            type='password'
            {...register('password', {
              required: 'Password is required',
              pattern: {
                value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/,
                message: 'Password must be 6-15 characters and include at least one uppercase letter, one lowercase letter, and one number',
              },
            })}
          />
          {errors.password && <p style={errorMessage}>{errors.password.message}</p>}
        </Form.Field>

        <Form.Field>
          <input
          placeholder='Confirm Password'
          type='password'
          {...register("confirm_password", {
            required: 'Please confirm your password',
            validate: (val) => {
              if (watch('password') !== val) {
                return "Your passwords do no match";
              }
            },
          })}
          />
          {errors.confirm_password && <p style={errorMessage}>{errors.confirm_password.message}</p>}
        </Form.Field>

        {userRole === 'admin' && (
          <Form.Field>
            <input
              id="balance_quantity"
              placeholder="Add balance"
              type="number"
              max="100000"
              {...register('balance', {
                required: 'Balance is required for admin',
                valueAsNumber: true,
                validate: (value) =>
                  value > 0 || 'Balance must be a positive number',
              })}
            />
            {errors.balance && <p style={errorMessage}>{errors.balance.message}</p>}
          </Form.Field>
        )}
        <Button type='submit'>Submit</Button>
      </Form>
    </div>
  );
};

export default Register;
