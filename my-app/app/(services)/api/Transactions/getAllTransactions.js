import axios from 'axios';
import baseURL from '../../../../assets/common/baseUrl';

// Get All Exercises
const getAllTransactions = async () => {
    const response = await axios.get(`${baseURL}/transaction/get-all-transactions`); 
    return response.data;
};

export { getAllTransactions };
