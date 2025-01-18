import { Platform } from 'react-native'



let baseURL = '';

{Platform.OS == 'android'

? baseURL = 'http://172.20.10.4:8080/api/v1'
: baseURL = 'http://172.20.10.4:8080/api/v1'

// ? baseURL = 'https://pspmobile.onrender.com/api/v1'
// : baseURL = 'https://pspmobile.onrender.com/api/v1'
}

export default baseURL;