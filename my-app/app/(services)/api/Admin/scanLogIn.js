import axios from 'axios';
import baseURL from '../../../../assets/common/baseUrl';

// Get User Data by ID
const getUserData = async (id) => {
  try {
    const response = await axios.get(`${baseURL}/users/get-user/${id}`);
    if (response.status === 200) {
      return response.data;  // Assuming that the response structure contains the user data
    } else {
      throw new Error('User data not found');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);  // Log the error to the console
    throw error;  // Rethrow the error so it can be caught in the component
  }
};

export { getUserData };
