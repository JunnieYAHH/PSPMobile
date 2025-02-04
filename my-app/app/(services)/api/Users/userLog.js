import axios from 'axios';
import baseURL from '../../../../assets/common/baseUrl';

// Get User Data by ID
const userLog = async (id, adminBranchId) => {
    const response = await axios.post(`${baseURL}/users/user-log/${id}`, { adminBranchId });
    return response.data;
};

export { userLog };
