import axios from 'axios';
import baseURL from '../../../../assets/common/baseUrl';

const submitParQ = async ({ q1, q2, q3, q4, q5, q6, q7, userId }) => {
    try {
        const response = await axios.post(`${baseURL}/clients/submit-par-Q`, {
            userId, q1, q2, q3, q4, q5, q6, q7
        });

        return response.data;
    } catch (error) {
        console.error("Submission error: at submitParQ (services)", error.response?.data || error.message);
        throw error;
    }
};

export { submitParQ };
