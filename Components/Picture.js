import React from 'react';
import { View, Text } from 'react-native';

const Picture = ({ route, navigation }) => {
    let img = route.params.image;
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Picture Page</Text>
    </View>
  );
}


export default Picture;