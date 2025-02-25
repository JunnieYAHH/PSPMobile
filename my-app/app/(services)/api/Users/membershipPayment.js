import axios from 'axios';
import baseURL from '../../../../assets/common/baseUrl'
// Login
const MembershipPayment = async ({ userId, userBranch, birthDate,
    address, city, phone, emergencyContactName,
    emergencyContactNumber, promo,
    agreeTerms, stripeSubscriptionId, signature
}) => {

    try {
        const response = await axios.post(`${baseURL}/payments/create-psp-subscription-transaction`, {
            userId, userBranch, birthDate: new Date(birthDate).toISOString(), 
            address, city, phone, emergencyContactName,
            emergencyContactNumber, promo, agreeTerms, stripeSubscriptionId, signature
        });

        // console.log('Membership Form Response', response)
        return response.data;
    } catch (error) {
        console.log('Error API Membership multipart json StripeSubscriptionId', error)
        console.log('Error API Membership multipart json StripeSubscriptionId', error.message)
    }
};

export { MembershipPayment };
