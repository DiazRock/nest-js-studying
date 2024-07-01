import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3000";


export const registerUser = async (userData) => {
    return axios.post(`${API_BASE_URL}/register`, userData);
};
  
  export const loginUser = async (loginData) => {
    return axios.post(`${API_BASE_URL}/login`, loginData);
};

export const createUser = async (userData) => {
    try {

        console.log("Creating user ", userData);
        console.log("API base url ", `${API_BASE_URL}/users`);
        const response = await axios.post(`${API_BASE_URL}/users`, userData).catch(err => console.log('Error createing the user ', err));
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createPayment = async (paymentData) => {
    try {
        console.log("Payment data ", paymentData);
        console.log("Payment data ", API_BASE_URL);
        const response = await axios.post(`${API_BASE_URL}/payments`, paymentData).catch(err => console.log('Error making payment ', err));
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const listUsers = async () => {
    return axios.get(`${API_BASE_URL}/users`);
  };

export const listPayments = async () => {
    return axios.get(`${API_BASE_URL}/payments`);
  };