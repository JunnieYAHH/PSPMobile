import axios from 'axios';
import baseURL from '../../../../assets/common/baseUrl';

const getTimedInLogs = async ({ userBranch }) => {
    const response = await axios.post(`${baseURL}/users/get-timedin-logs`, { userBranch });
    return response.data;
};

export { getTimedInLogs };
