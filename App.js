import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {Container, Content} from 'native-base';
import Swiper from 'react-native-swiper';
import CameraPage from './Components/CameraPage';

const App = () => {
  return (
    <Container>
      <Content>
        <Swiper
        loop = {false}
        showsPagination = {false}
        index = {1}
        >
          <View style = {styles.slideDefault}>
            <Text style = {styles.text}>Rendered</Text>
          </View>

          <View style = {{flex:1}}>
              <CameraPage />
          </View>

          <View style = {styles.slideDefault}>
            <Text style = {styles.text}>Saved</Text>
          </View>
        </Swiper>
      </Content>
    </Container>
  );
}

const styles = StyleSheet.create({
  slideDefault: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9dd6eb'
  },

  text: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold'
  }
});


export default App;
