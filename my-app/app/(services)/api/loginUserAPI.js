import axios from 'axios';

// Login
const loginUser = async ({ email, password }) => {
    const response = await axios.post(
        "http://192.168.100.89:8080/api/v1/users/login",
        { email, password }
    );
    return response.data;
};

export { loginUser };
