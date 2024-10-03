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
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({label, inputAmount}, e) => {
    e.preventDefault()
    try {
      const amount = Number(inputAmount)
      const reponse = await createPayment({ amount, userId, label }, jwtToken);
      alert ('Payment created successfully :)');
      return true;
    } catch (error) {
      alert ('Failed to createt payment :(');
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
              required: true,
            })}
            />
        </Form.Field>
        {errors.label && <p style={errorMessage}>Please enter a label for the payment</p>}

        <Form.Field>
            <input 
              type="number" 
              placeholder="Set amount of the payment" 
              {...register('inputAmount', {
                required: true,
                validator: (amount) => {
                  if (Number(watch(amount)) > 0) {
                    return true;
                  }
                  return false;
                }
              })}
            />

        </Form.Field>
        {errors.amount && <p style={errorMessage}>Amount must be a positive number</p>}
        <Button type="submit">Create Payment</Button>
    </Form>
  );
};

export default CreatePayment;
