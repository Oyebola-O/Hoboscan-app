import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import { Header, Icon } from 'native-base';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

const CameraPage = ({ changePage, navigation }) => {
    // ############ Image Picker #################
    const [hasRollPerm, setHasRollPerm] = useState(null);
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
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            if (!result.cancelled) {
                usePicture(result)
            }
        } catch (E) {
            console.log(E);
        }
    };



    // ############### Camera ####################
    const camera = useRef();
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
    const [flashIcon, setFlashIcon] = useState('ios-flash-off');

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const takePicture = async () => {
        try {
            let camPic = await camera.current.takePictureAsync();
            usePicture(camPic)
        } catch (error) {
            console.log(error);
        }
    }

    // Calling Views
    if (hasPermission == null) { return <View /> }
    if (hasPermission == false) { return <Text> Sorry, no camera access </Text> }
    if (hasRollPerm == null) { return <View /> }
    if (hasRollPerm == false) { return <Text> Sorry, no camera roll access </Text> }

    const usePicture = (image) => {
        navigation.navigate('Picture', { image });
    }


    return (
        <View style={{ flex: 1 }}>
            <Camera ref={camera} style={{ flex: 1, justifyContent: 'space-between' }} type={type}>
                <Header style={styles.header}>
                    <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-around' }}>
                        <Icon onPress={() => navigation.navigate('Edit')} type='Feather' name='edit' style={{ color: 'white', fontSize: 25 }} />
                        <Icon onPress={() => pickImage()} type='FontAwesome' name='photo' style={{ color: 'white', fontSize: 25 }} />
                    </View>

                    <View style={{ flexDirection: 'row', flex: 4, justifyContent: 'center' }}>
                        <Text style={{ color: 'white', fontSize: 20 }}>HÖBO SCAN</Text>
                    </View>

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
                            name={flashIcon} style={{ color: 'white' }} />
                        <Icon
                            onPress={() => {
                                setType(type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back)
                            }}
                            name='ios-reverse-camera' style={{ color: 'white' }} />
                    </View>
                </Header>


                <View style={styles.footer}>
                    <View>
                        <Icon
                            onPress={() => takePicture()}
                            type='Entypo' name='circle' style={{ color: 'white', fontSize: 80, paddingBottom: 10 }}></Icon>
                    </View>
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
        top: 30,
        right: 0,
        zIndex: 100
    },

    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: 20,
        marginBottom: 30,
        alignItems: "flex-end"
    }
});

export default CameraPage;