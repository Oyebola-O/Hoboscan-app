import React from 'react';
import { View, Text, ImageBackground, StyleSheet } from 'react-native';
import { Header, Icon } from 'native-base';

const Picture = ({ route, navigation }) => {
    let img = route.params.image;
    console.log(img.uri)
    return (
        <ImageBackground
        source = {{uri: img.uri}}
        style = {{flex: 1, width: '100%', height: '100%' }}
        >
            <Header style={styles.header}>
                <Icon 
                onPress={() => navigation.navigate('Main')}
                type='FontAwesome' name='close' style={{fontSize: 30, color:'white'}}></Icon>
                <Icon type='AntDesign' name='scan1' style={{fontSize: 30, color:'white'}}></Icon>
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