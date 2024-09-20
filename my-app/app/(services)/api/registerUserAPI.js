import axios from 'axios';

const registerUser = async ({ email, password, name, phone, userBranch, isAdmin = false, image }) => {
    try {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('name', name);
        formData.append('phone', phone);
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

        const response = await axios.post(
            "http://192.168.100.89:8080/api/v1/users/register",
            formData,
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