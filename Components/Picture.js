import React, { useState } from 'react'
import { Dimensions, ImageBackground, StyleSheet, View, ActivityIndicator, Image, Alert, Text } from 'react-native'
import { ImageManipulator } from 'expo-image-crop'
import { Icon } from 'native-base';
import * as firebase from 'firebase';
import config from '../config';

const Picture = ({ route, navigation }) => {
    
    if(!firebase.apps.length) firebase.initializeApp(config.firebaseConfig);

    const [showLoader, setShowLoader] = useState(false);
    const ENDPOINT = config.ENDPOINT;
    const KEY = config.KEY;
    const img = route.params.image;
    let ref

    const [isVisible, setIsVisible] = useState(false)
    const [uri, setUri] = useState(img.uri)


    const onToggleModal = () => {
        isVisible == true ? setIsVisible(false) : setIsVisible(true)
    }

    const { width, height } = Dimensions.get('window')

    /***** ALERTS *****/
    const executeDismiss = () => {
        setShowLoader(false);
        navigation.navigate('Main');
    }

    const uploadAlert = () => {
        Alert.alert(
            "Ayyy! We couldn't upload the photo",
            "Check your internet connection",
            [
                { text: "OK", onPress: () => executeDismiss() }
            ],
            { cancelable: true, onDismiss: () => executeDismiss() }
        );
    }

    const sendPictureAlert = () => {
        Alert.alert(
            "Ayyy! It seems there might be something wrong with your image",
            "The image file might be too big or too small",
            [
                { text: "OK", onPress: () => executeDismiss() }
            ],
            { cancelable: true, onDismiss: () => executeDismiss() }
        );
    }

    const microsoftAlert = () => {
        Alert.alert(
            "Ayyy! It seems there might be something wrong on our end",
            "HÖBO sincerely apologizes for this",
            [
                { text: "OK", onPress: () => executeDismiss() }
            ],
            { cancelable: true, onDismiss: () => executeDismiss() }
        );
    }

    const failAlert = () => {
        Alert.alert(
            "Ayyy! It seems we could not read this image",
            "The image either wasn't taken well or does not contain any text. Try again with a more suitable image",
            [
                { text: "OK", onPress: () => executeDismiss() }
            ],
            { cancelable: true, onDismiss: () => executeDismiss() }
        );
    }

    /***** API CALLS *****/
    const uploadToCloud = async (uploadFile) => {
        try {
            let name = `pic${~~(Math.random()*10000)}`
            let blob = await fetch(uploadFile.uri)
            blob = await blob.blob();
    
            ref = firebase.storage().ref().child(`images/${name}`)
            let snapshot = await ref.put(blob)
            blob.close()
            let res = await snapshot.ref.getDownloadURL();
            return res
        } catch (error) {
            console.log(`ERROR IN uploadToCloud CATCH BLOCK ${error}`)
            return 'ERROR'
        }
    }

    const deleteImage = async () => {
        try {
            ref.delete()
        } catch (error) {
            console.log('ERROR IN deleteImage')
        }
    }

    const getLocationUrl = async (fileurl) => {
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
            if (res.status != 202) {
                console.log(res.status)
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
        let timer = setInterval(async function () {
            let head = new Headers();
            head.append("Ocp-Apim-Subscription-Key", KEY);
            var requestOptions = {
                method: 'GET',
                headers: head,
                redirect: 'follow'
            };
            let res = await fetch(location, requestOptions);
            if (res.status != 200) {
                clearInterval(timer)
                microsoftAlert()
                deleteImage()
            } else {
                res = await res.text()
                let text = JSON.parse(res)

                if (text.status == 'running' || text.status == 'notStarted') {
                    console.log(text.status)
                } else if (text.status == 'succeeded') {
                    clearInterval(timer)
                    navigation.navigate('Main', { text });
                    deleteImage()
                } else {
                    console.log(`ERROR IN getResult WITH STATUS:${text.status}`)
                    clearInterval(timer)
                    failAlert()
                    deleteImage()
                }
            }
        }, 1000);
    }


    const processImage = async () => {
        setShowLoader(true)
        let file = { uri: uri, type: `test/${uri.split('.')[1]}`, name: `test.${uri.split('.')[1]}` };
        let fileurl = await uploadToCloud(file);
        if (fileurl != 'ERROR') {
            let locationUrl = await getLocationUrl(fileurl);
            if (locationUrl != 'ERROR') {
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
            <ImageBackground
                resizeMode="contain"
                style={{
                    height, width,
                    backgroundColor: 'black',
                }}
                source={{ uri }}
            >
                <View style={styles.header}>
                    <Icon onPress={() => navigation.navigate('Main')} type='FontAwesome' name='close' style={styles.button} />
                    <Icon onPress={() => setIsVisible(true)} type='Entypo' name='crop' style={styles.button} />
                    <Icon onPress={() => processImage()} type='FontAwesome5' name='brain' style={styles.button} />
                </View>

                <ImageManipulator
                    photo={{ uri }}
                    isVisible={isVisible}
                    onPictureChoosed={({ uri: uriM }) => setUri(uriM)}
                    onToggleModal={onToggleModal}
                />
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
    },

    button: {
        fontSize: 30,
        color: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 5
    }
});

export default Picture;