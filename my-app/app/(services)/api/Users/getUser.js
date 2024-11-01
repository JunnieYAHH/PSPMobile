import axios from 'axios';
import baseURL from '../../../../assets/common/baseUrl';

// Get User Data by ID
const getUserData = async (id) => {
    const response = await axios.get(`${baseURL}/users/get-user/${id}`);
    return response.data;
};

export { getUserData };
