import axios from 'axios';
import baseURL from '../../../../assets/common/baseUrl';

// Get User Data by ID
const getAllUsers = async () => {
    const response = await axios.get(`${baseURL}/users/get-all-users`);
    return response.data.users;
};

export { getAllUsers };
