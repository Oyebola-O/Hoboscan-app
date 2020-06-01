import React , { useState } from 'react';
import { Text, ImageBackground, StyleSheet, View, Dimensions, ActivityIndicator, Image } from 'react-native';
import { Header, Icon } from 'native-base';
import config from '../config'

const Picture = ({ route, navigation }) => {
    const [showLoader, setShowLoader] = useState(false);
    const ENDPOINT = config.ENDPOINT;
    const KEY = config.KEY;
    const img = route.params.image;
    let file = { uri:img.uri, type: `test/${img.uri.split('.')[1]}`, name:`test.${img.uri.split('.')[1]}`};
    const [imageWidth, imageHeight] = [img.width, img.height]
    const {height, width} = Dimensions.get('window');


    const uploadToCloud = async(uploadFile) => {
        try {
            const data = new FormData();
            data.append('file',uploadFile)
            data.append('upload_preset', 'hoboscanapp')
            data.append('cloud_name', 'hoboscan')
            let url = "https://api.cloudinary.com/v1_1/hoboscan/image/upload"
            let res = await fetch(url, {method: 'POST', body:data});
            res = await res.json()
            return res.url
        } catch (error) {
            console.log(`Error ${error}`)
        }
    }

    const getResult = async(location) => {
        let head = new Headers();
        head.append("Ocp-Apim-Subscription-Key", KEY);
        var requestOptions = {
            method: 'GET',
            headers: head,
            redirect: 'follow'
        };
        fetch(location, requestOptions)
        .then(response => response.text())
        .then(result => {
            const text = JSON.parse(result);
            if(text.status == 'running' || text.status == 'notStarted'){
                console.log(text.status)
                getResult(location)
            } else if(text.status == 'succeeded'){
                navigation.navigate('Edit', { text });
            } else {
                console.log(`Theres a problem in getResult status:${text.status}`)
            }
        })
        .catch(error => console.log('error', error));
    }


    const sendPicture = async() => {
        setShowLoader(true)
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Ocp-Apim-Subscription-Key", KEY);

        let fileurl = await uploadToCloud(file);
        const raw = JSON.stringify({"url": fileurl});

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(`${ENDPOINT}vision/v3.0/read/analyze`, requestOptions)
        .then(response => {
            getResult(response.headers.map["operation-location"]);
        })
        .catch(error => console.log('error', error));
    }

    if(showLoader){
        return (
            <View style={{flex: 1, justifyContent:'center', alignItems:'center'}}>
                <Image source={require('../assets/hoboscan.png')} style={{width: 300, height: 300}} />
                <View style={{flexDirection:'row'}}>
                <Text style={{fontSize:17}}>Processing </Text>
                <ActivityIndicator size="small" color='black' />
                </View>
                <Text style={{position: 'absolute', bottom:30}}>HÖBO™</Text>
            </View>
        );
    } else {
        return (
            <ImageBackground source = {{uri: img.uri}} style = {{flex: 1, width: '100%', height: '100%' }}>
                <View style={styles.header}>
                    <Icon onPress={() => navigation.navigate('Camera')} type='FontAwesome' name='close' style={{fontSize: 30, color:'white'}}/>
                    <Icon onPress={() => sendPicture()} type='FontAwesome5' name='brain' style={{fontSize: 30, color:'white'}}/>
                </View>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        flex:1,
        flexDirection:'row',
        position: 'absolute',
        width:'100%',
        paddingTop:25,
        paddingLeft:20,
        paddingRight:20,
        backgroundColor: 'transparent',
        justifyContent: 'space-between',
        zIndex: 100
    }
});

export default Picture;