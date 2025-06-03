import axios from 'axios';
import baseURL from '../../../../assets/common/baseUrl';

// Get User Data by ID
const getTimedInLogs = async () => {
    const response = await axios.get(`${baseURL}/users/get-timedin-logs`);
    return response.data;
};

export { getTimedInLogs };
