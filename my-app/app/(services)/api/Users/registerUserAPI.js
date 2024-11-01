import axios from 'axios';
import baseURL from '../../../../assets/common/baseUrl'

const registerUser = async ({ email, password, name, phone, userBranch, isAdmin = false, image,
    birthDate, generalAccess, otherAccess, address, city,
    emergencyContanctName, emergencyContanctNumber
 }) => {
    try {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('name', name);
        formData.append('birthDate', birthDate);
        formData.append('address', address);
        formData.append('city', city);
        formData.append('phone', phone);
        formData.append('generalAccess', generalAccess);
        formData.append('otherAccess', otherAccess);
        formData.append('emergencyContanctName', emergencyContanctName);
        formData.append('emergencyContanctNumber', emergencyContanctNumber);
        formData.append('userBranch', userBranch);
        formData.append('isAdmin', isAdmin.toString());

        if (image) {
            const fileName = image.split('/').pop();
            formData.append('image', {
                uri: image,
                type: 'image/jpeg',
                name: fileName,
            });
        }

        const response = await axios.post(`${baseURL}/users/register`, formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Registration error: at registerAPI", error.response?.data || error.message);
        throw error;
    }
};


export { registerUser };
