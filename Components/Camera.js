import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Button, Image, Linking } from 'react-native';
import { Camera } from 'expo-camera';
import { Header, Icon } from 'native-base';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

const CameraPage = ({ route, navigation, changePage  }) => {
    const camera = useRef();
    const [hasCameraPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
    const [flashIcon, setFlashIcon] = useState('ios-flash-off');
    const [hasRollPerm, setHasRollPerm] = useState(null);


    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    useEffect(() => {
        (async () => {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            setHasRollPerm(status === 'granted');
        })();
    }, []);

    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
            });
            if (!result.cancelled) {
                usePicture(result)
            }
        } catch (error) {
            console.log(error);
        }
    };

    const takePicture = async () => {
        try {
            let camPic = await camera.current.takePictureAsync();
            usePicture(camPic)
        } catch (error) {
            console.log(error);
        }
    }

    if (hasCameraPermission == null || hasCameraPermission == false || hasRollPerm == null || hasRollPerm == false) {
        return (
            <View style={{flex: 1, justifyContent:'center', alignItems:'center', width: 250, alignSelf:'center'}}>
                <Image source={require('../assets/hoboscan.png')} style={{width: 300, height: 300}} />
                <Text style={{fontSize:25}}>Ayyy!</Text>
                <Text style={{textAlign:'center', fontSize:15}}>You are probably getting this screen because you don't have camera or cameral roll access enabled</Text>
                <Button title="Enable Camera Access" onPress={()=> Linking.openSettings()}/>
            </View>
        );
    }

    const usePicture = (image) => {
        navigation.navigate('Picture', { image });
    }


    return (
        <View style={{ flex: 1 }}>
            <Camera ref={camera} style={{ flex: 1, justifyContent: 'space-between' }} type={type}>
                <View style={styles.header}>
                    <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-around' }}>
                        <Icon
                            onPress={() => {
                                if (flash == Camera.Constants.FlashMode.off) {
                                    setFlash(Camera.Constants.FlashMode.on);
                                    setFlashIcon('ios-flash');
                                } else {
                                    setFlash(Camera.Constants.FlashMode.off);
                                    setFlashIcon('ios-flash-off');
                                }
                            }}
                            name={flashIcon} style={styles.button1} />
                        <Icon
                            onPress={() => {
                                setType(type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back)
                            }}
                            name='ios-reverse-camera' style={styles.button1} />
                    </View>

                    <View style={{ flexDirection: 'row', flex: 2, justifyContent: 'center'}}>
                        <Text style={{ color: 'white', fontSize: 20 }}>HÖBOscan</Text>
                    </View>

                    <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-around' }}>
                        <Icon onPress={() => pickImage()} type='FontAwesome' name='photo' style={styles.button} />
                        <Icon onPress={() => changePage(1)} type='Feather' name='edit' style={styles.button} />
                    </View>
                </View>


                <View style={{position: "absolute", bottom: 30, alignSelf:'center'}}>
                    <Icon onPress={() => takePicture()}
                        type='Entypo' name='circle' style={{ color: 'white', fontSize: 80, paddingBottom: 10 }}/>
                </View>
            </Camera>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        width:'100%',
        flexDirection:'row',
        paddingTop:45,
        paddingLeft:10,
        paddingRight:10,
        backgroundColor: 'transparent',
        zIndex: 100
    },

    button1: {
        color: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 5,  
        elevation: 5
    },

    button: {
        fontSize: 25, 
        color: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 5,  
        elevation: 5
    }
});

export default CameraPage;
