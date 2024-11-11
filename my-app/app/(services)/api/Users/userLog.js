import axios from 'axios';
import baseURL from '../../../../assets/common/baseUrl';

// Get User Data by ID
const userLog = async (id) => {
    const response = await axios.post(`${baseURL}/users/user-log/${id}`);
    return response.data;
};

export { userLog };
