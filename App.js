import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Main from './Components/Main';
import Picture from './Components/Picture';

const Stack = createStackNavigator();
/*
https://hoboscan.cognitiveservices.azure.com/
ae7268df79344ec79e8b7da75921c54b

*/

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={Main}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen 
        name="Picture" 
        component={Picture} 
        options={{
          headerShown: false
        }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;