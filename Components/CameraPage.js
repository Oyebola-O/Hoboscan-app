import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import {Camera} from 'expo-camera';
import {Container, Content, Header, Item, Icon, Input, Button} from 'native-base';

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
            <Camera style={{flex: 1,  justifyContent:'space-between'}} type={type}>
                <Header style={styles.header}>
                    <View style={{flexDirection:'row', flex:1, justifyContent:'center'}}>
                        <Icon type='FontAwesome' name='photo' style={{color:'white'}}/>
                    </View>

                    <View style={{flexDirection:'row', flex:4, justifyContent:'center'}}>
                        <Text style={{color:'white', fontSize:20}}>HÖBO SCAN</Text>
                    </View>

                    <View style={{flexDirection:'row', flex:1, justifyContent:'space-around'}}>
                        <Icon name='ios-flash' style={{color:'white'}}/>
                        <Icon
                        onPress={()=> {
                            setType(type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back)
                        }}
                        name='ios-reverse-camera' style={{color:'white'}}/>
                    </View>
                </Header>
                <View style={styles.footer}>
                    <Icon type='Foundation' name='page-edit' style={{color:'white'}}/>
                    <View>
                        <Icon type='Entypo' name='circle' style={{color:'white', fontSize: 80, paddingBottom:10}}></Icon>
                    </View>
                    <Icon type='MaterialIcons' name='storage' style={{color:'white'}}/>
                </View>
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
    },

    footer: {
        flexDirection:'row',
        justifyContent:'space-between',
        paddingHorizontal:20,
        marginBottom:88,
        alignItems: "flex-end"
    }
});

export default CameraPage;
