import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import {Camera} from 'expo-camera';
import {Container, Content, Header, Item, Icon, Input, Button} from 'native-base';

const CameraPage = ({changePage}) => {

    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
    const [flashIcon, setFlashIcon] = useState('ios-flash-off');

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
                        <Icon type='FontAwesome' name='photo' style={{color:'white', fontSize: 25}}/>
                    </View>

                    <View style={{flexDirection:'row', flex:4, justifyContent:'center'}}>
                        <Text style={{color:'white', fontSize:20}}>HÖBO SCAN</Text>
                    </View>

                    <View style={{flexDirection:'row', flex:1, justifyContent:'space-around'}}>
                        <Icon 
                        onPress={() => {
                            if(flash == Camera.Constants.FlashMode.off){
                                setFlash(Camera.Constants.FlashMode.on);
                                setFlashIcon('ios-flash');
                            } else {
                                setFlash(Camera.Constants.FlashMode.off);
                                setFlashIcon('ios-flash-off');
                            }
                        }}
                        name={flashIcon} style={{color:'white'}}/>
                        <Icon
                        onPress={()=> {
                            setType(type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back)
                        }}
                        name='ios-reverse-camera' style={{color:'white'}}/>
                    </View>
                </Header>
                <View style={styles.footer}>
                    <Icon
                    onPress={()=> changePage(0)}
                    type='Foundation' name='page-edit' style={{color:'white'}}/>
                    <View>
                        <Icon type='Entypo' name='circle' style={{color:'white', fontSize: 80, paddingBottom:10}}></Icon>
                    </View>
                    <Icon 
                    onPress={()=> changePage(2)}
                    type='MaterialIcons' name='storage' style={{color:'white'}}/>
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
