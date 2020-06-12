import {
    ENDPOINT, 
    KEY, 
    TRANSENDPOINT, 
    TRANSKEY,
    apiKey,
    authDomain,
    databaseURL,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    measurementId
} from 'react-native-dotenv'

firebaseConfig = {
    apiKey,
    authDomain,
    databaseURL,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    measurementId
}

export default {
    ENDPOINT, KEY, TRANSENDPOINT, TRANSKEY,firebaseConfig
}