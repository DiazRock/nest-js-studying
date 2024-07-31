import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3000";


export const registerUser = async (userData) => {
    console.log(`Registering user ${JSON.stringify(userData)}`);
    return axios.post(`${API_BASE_URL}/auth/api/register`, userData);
};
  

export const loginUser = async (loginData) => {
    const response = await axios.post(`${API_BASE_URL}/auth/api/login`, loginData);
    return response;
};


export const createUser = async (userData, jwtSession) => {
    try {

        console.log("Creating user ", userData);
        console.log("API base url ", `${API_BASE_URL}/users`);
        const response = await axios.post(
            `${API_BASE_URL}/users/`, userData,
            {
                headers: {
                    Authorization: `Bearer ${jwtSession}`
                }
            }
        ).catch(err => console.log('Error createing the user ', err));
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const createPayment = async (paymentData, jwtSession) => {
    try {
        console.log("Payment data ", paymentData);
        console.log("Payment data ", API_BASE_URL);
        const response = await axios.post(
            `${API_BASE_URL}/payments`, paymentData,
          {
            headers: {
                Authorization: `Bearer ${jwtSession}`
            }
          }).catch(err => console.log('Error making payment ', err));
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const listUsers = async (jwtSession) => {
    return await axios.get(`${API_BASE_URL}/users`, {
            headers: {
                Authorization: `Bearer ${jwtSession}`
            }
        }
    );
  };

export const getUserDetails = async (userId, jwtSession) => {
    return await axios.get(`${API_BASE_URL}/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${jwtSession}`
            }
        }
    );
  };

export const listPayments = async (jwtSession) => {
    return axios.get(`${API_BASE_URL}/payments`, {
        headers: {
            Authorization: `Bearer ${jwtSession}`
        }
    });
  };

export const listPaymentsByUser = async (id , jwtSession) => {
    return axios.get(`${API_BASE_URL}/payments/${id}`,  {
        headers: {
            Authorization: `Bearer ${jwtSession}`
        }
    });
  };

export const logoutUser = () => {
    localStorage.removeItem('session');
}

export const getUserPermissions = async (userId, jwtSession) => {

    const permissions = await axios.get(`${API_BASE_URL}/user/permissions/${userId}`, {
        headers: {
            Authorization: `Bearer ${jwtSession}`
        }
    })
    console.log('The permissions!!!! ', permissions);
}