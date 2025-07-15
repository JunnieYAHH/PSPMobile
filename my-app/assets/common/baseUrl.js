import { Platform } from 'react-native'



let baseURL = '';

{Platform.OS == 'android'

// ? baseURL = 'https://pspmobile.onrender.com/api/v1'
// : baseURL = 'https://pspmobile.onrender.com/api/v1'

? baseURL = 'http://192.168.100.108:8080/api/v1'
: baseURL = 'http://192.168.100.108:8080/api/v1'
}

export default baseURL;