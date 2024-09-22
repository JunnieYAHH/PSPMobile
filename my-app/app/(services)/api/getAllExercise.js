import axios from 'axios';
import baseURL from '../../../assets/common/baseUrl';

// Get All Exercises
const getAllExercise = async () => {
    const response = await axios.get(`${baseURL}/exercises/get-exercise`); 
    return response.data;
};

export { getAllExercise };
