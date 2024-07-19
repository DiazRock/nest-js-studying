import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3000";


export const registerUser = async (userData) => {
    console.log(`Registering user ${JSON.stringify(userData)}`);
    return axios.post(`${API_BASE_URL}/auth/api/register`, userData);
};
  

export const loginUser = async (loginData) => {
    const response = await axios.post(`${API_BASE_URL}/auth/api/login`, loginData);
    const token = response.data.access_token;
    const user_id = response.data.user_id;
    const permissions = response.data.user_permissions;
    const user_role = response.data.user_role;
    localStorage.setItem('session', token);
    localStorage.setItem('userId', user_id);
    localStorage.setItem('permissions', permissions);
    localStorage.setItem('user_role', user_role);
    console.log('User role ', user_role);
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

export const listPaymentsByUser = async (id) => {
    return axios.get(`${API_BASE_URL}/payments?id=${id}`);
  };

export const sessionIsActive = () => {
    const sessionInfo = localStorage.getItem('session');
    console.log(`Checking if the user is active ${sessionInfo} ${sessionInfo !== null}`);
    return localStorage.getItem('session') !== null;
}


export const logoutUser = () => {
    localStorage.removeItem('session');
}

export const getUserPermissions = async () => {
    const user_id = localStorage.getItem('user_id');
    const jwt = localStorage.getItem('session');

    const permissions = await axios.get(`${API_BASE_URL}/user/permissions/${user_id}`, {
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
    console.log('The permissions!!!! ', permissions);
}   