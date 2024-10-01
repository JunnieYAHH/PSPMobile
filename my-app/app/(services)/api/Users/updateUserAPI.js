import axios from 'axios';
import baseURL from '../../../../assets/common/baseUrl'

const updateUser = async ({ _id, email, name, image }) => {
    try {
        const formData = new FormData();
        formData.append('_id', _id);
        formData.append('email', email);
        formData.append('name', name);

        // console.log("This is form data", formData)
        if (image) {
            const fileName = image.split('/').pop();
            formData.append('image', {
                uri: image,
                type: 'image/jpeg',
                name: fileName,
            });
        }

        const response = await axios.put(`${baseURL}/users/update`,formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        // console.log("Complete Response in API:", response); 
        return response.data;
    } catch (error) {
        console.error("Update error: at UpdateAPI", error.response?.data || error.message.error);
        throw error;
    }
};


export { updateUser };
