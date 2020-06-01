import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Camera from './Components/Camera';
import Picture from './Components/Picture';
import Edit from './Components/Edit';

const Stack = createStackNavigator();

const App = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen name="Camera" component={Camera} options={{ headerShown: false }} />

				<Stack.Screen name="Edit" component={Edit} options={{ headerShown: false }} />

				<Stack.Screen name="Picture" component={Picture} options={{ headerShown: false }} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}

export default App;