import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Main from './Components/Main';
import Picture from './Components/Picture';

const Stack = createStackNavigator();
// const Transition = (index, position) => {

// }

// const NavigationConfig = () => {

// }

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