import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import {Camera} from 'expo-camera';
import {Container, Content, Header, Item, Icon, Input, Button} from 'native-base';
import {MaterialCommunityIcons} from 'react-native-vector-icons/MaterialCommunityIcons';

const CameraPage = () => {

    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);

    useEffect(() => {
        (async () => {
            const {status} = await Camera.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    if(hasPermission == null){ return <View /> }

    if(hasPermission == false){ return <Text> Sorry, no camera access </Text> }

    return (
        <View style={{flex: 1}}>
            <Camera style={{flex: 1}} type={type}>
                <Header style={styles.header}>

                </Header>
            </Camera>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        backgroundColor: 'transparent',
        left: 0,
        top: 0,
        right: 0,
        zIndex: 100
    }
});

export default CameraPage;
