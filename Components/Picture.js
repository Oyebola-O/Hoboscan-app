import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { Header, Icon } from 'native-base';
import config from '../config'

const Picture = ({ route, navigation }) => {
    const ENDPOINT = config.ENDPOINT;
    const KEY = config.KEY;
    const img = route.params.image;
    let file = { uri:img.uri, type: `test/${img.uri.split('.')[1]}`, name:`test.${img.uri.split('.')[1]}`};

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
                console.log(text);
            } else {
                console.log(`Theres a problem in getResult status:${text.status}`)
            }
        })
        .catch(error => console.log('error', error));
    }


    const sendPicture = async() => {
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

    return (
        <ImageBackground
        source = {{uri: img.uri}}
        style = {{flex: 1, width: '100%', height: '100%' }}
        >
            <Header style={styles.header}>
                <Icon 
                onPress={() => navigation.navigate('Main')}
                type='FontAwesome' name='close' style={{fontSize: 30, color:'white'}}></Icon>
                <Icon
                onPress={() => sendPicture()}
                type='AntDesign' name='scan1' style={{fontSize: 30, color:'white'}}></Icon>
            </Header>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        backgroundColor: 'transparent',
        justifyContent: 'space-between',
        left: 20,
        top: 30,
        right: 20,
        borderBottomWidth: 0,
        zIndex: 100
    }
});

export default Picture;