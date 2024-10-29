import axios from 'axios';
import baseURL from '../../../../assets/common/baseUrl';

// Get All Exercises
const getAllBranch = async () => {
    const response = await axios.get(`${baseURL}/branch/get-branches`); 
    return response.data;
};

export { getAllBranch };
