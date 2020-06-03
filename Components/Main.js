import React, { useState, useRef, useEffect } from 'react';
import { View, Keyboard } from 'react-native';
import { Container, Content } from 'native-base';
import Swiper from 'react-native-swiper';
import Camera from './Camera'
import Edit from './Edit';

const Main = ({route, navigation}) => {

    const swiper = useRef(null)
    const changePage = (indx) => { swiper.current.scrollTo(indx) }

    useEffect(()=> {
        try {
            if(route.params != undefined){ changePage(1) }
        } catch (error) {
            console.log(error)
        }
    })


    return (
        <Swiper ref={swiper} loop={false} showsPagination={false} index={0} 
        onIndexChanged={()=>Keyboard.dismiss()}>
            <View style={{ flex: 1 }}>
                <Camera route={route} navigation={navigation} changePage={changePage}/>
            </View>

            <View style={{ flex: 1 }}>
                <Edit route={route} navigation={navigation} changePage={changePage}/>
            </View>
        </Swiper>
    );
}


export default Main;
