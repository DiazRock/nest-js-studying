const axios = require('axios');

// Read API_BASE_URL from environment variables
const apiBaseUrl = 'http://api_gateway:3000';

async function fetchData() {
  try {
    const userData = {
        username: "Norman",
        displayName: "Osborn",
        email: "greengoblin@gmail.com"
    }
    const response = await axios.post(`${apiBaseUrl}/users`, userData).catch(err => console.log('Error createing the user ', err));
    console.log('Response data:', response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

fetchData();
