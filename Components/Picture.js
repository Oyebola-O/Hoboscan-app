import React, { useState } from 'react';
import { Text, ImageBackground, StyleSheet, View, ActivityIndicator, Image, Alert } from 'react-native';
import { Icon } from 'native-base';
import config from '../config'

const Picture = ({ route, navigation }) => {
    const [showLoader, setShowLoader] = useState(false);
    const ENDPOINT = config.ENDPOINT;
    const KEY = config.KEY;
    const img = route.params.image;
    let file = { uri: img.uri, type: `test/${img.uri.split('.')[1]}`, name: `test.${img.uri.split('.')[1]}` };

    /***** ALERTS *****/
    const executeDismiss = () => {
        setShowLoader(false);
        navigation.navigate('Camera');
    }

    const uploadAlert = () => {
        Alert.alert(
            "Ayyy! We couldn't upload the photo",
            "The problem is either your internet connection or the image is too large",
            [
                { text: "OK", onPress: () => executeDismiss() }
            ],
            { cancelable: true, onDismiss: () => executeDismiss() }
        );
    }

    const sendPictureAlert = () => {
        Alert.alert(
            "Ayyy! It seems there might be something wrong with your image",
            "The image is either blury, has no text or has an unconventional size or dimension",
            [
                { text: "OK", onPress: () => executeDismiss() }
            ],
            { cancelable: true, onDismiss: () => executeDismiss() }
        );
    }

    const microsoftAlert = () => {
        Alert.alert(
            "Ayyy! It seems there might be something wrong on our end",
            "HÖBO sincerely apologizes for this error",
            [
                { text: "OK", onPress: () => executeDismiss() }
            ],
            { cancelable: true, onDismiss: () => executeDismiss() }
        );
    }

    const failAlert = () => {
        Alert.alert(
            "Ayyy! It seems we could not read this image",
            "The image either wasn't taken well or does not contain any text. Try taking it again with a more suitable image",
            [
                { text: "OK", onPress: () => executeDismiss() }
            ],
            { cancelable: true, onDismiss: () => executeDismiss() }
        );
    }

    /***** API CALLS *****/
    const uploadToCloud = async (uploadFile) => {
        try {
            const data = new FormData();
            data.append('file', uploadFile)
            data.append('upload_preset', 'hoboscanapp')
            data.append('cloud_name', 'hoboscan')
            let url = "https://api.cloudinary.com/v1_1/hoboscan/image/upload"
            let res = await fetch(url, { method: 'POST', body: data });
            res = await res.json()
            return res.url
        } catch (error) {
            console.log(`ERROR IN uploadToCloud CATCH BLOCK ${error}`)
            return 'ERROR'
        }
    }

    const getLocationUrl = async(fileurl) => {
        try {
            let myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Ocp-Apim-Subscription-Key", KEY);
    
            const raw = JSON.stringify({ "url": fileurl });
    
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
    
            let res = await fetch(`${ENDPOINT}vision/v3.0/read/analyze`, requestOptions);
            if(res.status != 202){ 
                console.log('ERROR IN getLocationUrl CHECK STATUS BLOCK')
                return 'ERROR'
            } else {
                return res.headers.map["operation-location"];
            }
        } catch (error) {
            console.log('ERROR IN getUrlLocation CATCH BLOCK');
            return 'ERROR'
        }
    }


    const recurse = (location) => {
        let timer = setInterval(async function(){
            let head = new Headers();
            head.append("Ocp-Apim-Subscription-Key", KEY);
            var requestOptions = {
                method: 'GET',
                headers: head,
                redirect: 'follow'
            };
            let res = await fetch(location, requestOptions);
            if(res.status != 200){
                console.log(res.status)
                clearInterval(timer)
                microsoftAlert()
            } else {
                res = await res.text()
                let text = JSON.parse(res)
        
                if (text.status == 'running' || text.status == 'notStarted') {
                    console.log(text.status)
                } else if (text.status == 'succeeded') {
                    clearInterval(timer)
                    navigation.navigate('Main', { text });
                } else {
                    console.log(`ERROR IN getResult WITH STATUS:${text.status}`)
                    clearInterval(timer)
                    failAlert()
                }
            }
        }, 1000);
    }


    const processImage = async() => {
        setShowLoader(true)
        let fileurl = await uploadToCloud(file);
        if(fileurl != 'ERROR'){
            let locationUrl = await getLocationUrl(fileurl);
            if(locationUrl != 'ERROR'){
                recurse(locationUrl)
            } else { sendPictureAlert() }
        } else { uploadAlert() }
    }

    /**** RENDER ****/
    if (showLoader) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={require('../assets/copy.png')} style={{ width: 300, height: 300 }} />
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontSize: 17 }}>Processing </Text>
                    <ActivityIndicator size="small" color='black' />
                </View>
                <Text style={{ position: 'absolute', bottom: 30 }}>HÖBO™</Text>
            </View>
        );
    } else {
        return (
            <ImageBackground source={{ uri: img.uri }} style={{ flex: 1, width: '100%', height: '100%' }}>
                <View style={styles.header}>
                    <Icon onPress={() => navigation.navigate('Camera')} type='FontAwesome' name='close' style={{ fontSize: 30, color: 'white' }} />
                    <Icon onPress={() => processImage()} type='FontAwesome5' name='brain' style={{ fontSize: 30, color: 'white' }} />
                </View>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        flex: 1,
        flexDirection: 'row',
        position: 'absolute',
        width: '100%',
        paddingTop: 45,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: 'transparent',
        justifyContent: 'space-between',
        zIndex: 100
    }
});

export default Picture;