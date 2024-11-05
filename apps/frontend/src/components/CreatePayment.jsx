// src/components/CreatePayment.js
import React from 'react';
import { createPayment } from '../services/apiService';
import { Form, Button } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { errorMessage } from '../styles'; 


const CreatePayment = () => {
  const jwtToken = useSelector((state) => state.loginReducer.jwtSession);
  const userId = useSelector((state) => state.loginReducer.userId);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({label, inputAmount}) => {
    try {
      const amount = parseFloat(inputAmount);
      const reponse = await createPayment({ amount, userId, label }, jwtToken);
      alert ('Payment created successfully :)');
      return true;
    } catch (error) {
      alert (`Failed to createt payment :( ${error}`);
      console.error('Failed to create payment', error);
      return false;
    }
  };

  return (
    <Form
          onSubmit={handleSubmit(onSubmit)}
          successText="Payment created successfully"
    >
        <h2>Create Payment</h2>
        <Form.Field>
          <input 
            type="text"  
            placeholder="Label" 
            {...register('label', {
              required: 'Please enter a label for the payment',
            })}
            />
        </Form.Field>
        {errors.label && <p style={errorMessage}>{errors.label.message}</p>}

        <Form.Field>
            <input 
              type="number" 
              placeholder="Set amount of the payment" 
              {...register('inputAmount', {
                required: 'Amount is required',
                validate: (value) => {
                  const amount = parseFloat(value);
                  return amount >= 0 || 'Amount must be a non negative number';
                }
              })}
            />

        </Form.Field>
        {errors.inputAmount && <p style={errorMessage}>{errors.inputAmount.message}</p>}
        <Button type="submit">Create Payment</Button>
    </Form>
  );
};

export default CreatePayment;
