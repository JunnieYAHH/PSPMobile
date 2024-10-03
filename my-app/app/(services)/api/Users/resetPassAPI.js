import axios from 'axios';
import baseURL from '../../../../assets/common/baseUrl';

// Reset Password
const resetPassword = async ({ currentPassword, newPassword, token }) => {
    try {
        const response = await axios.put(`${baseURL}/users/update-password`, 
            {
                currentPassword, 
                newPassword
            },
            {
                headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Reset error: at ResetAPI", error.response?.data || error.message);
        throw error;
    }
};

export { resetPassword };
