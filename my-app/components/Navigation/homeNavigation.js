import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LogBox } from 'react-native';
import ExerciseDetailsScreens from '../Screens/ExerciseDetailsScreens';

const Stack = createNativeStackNavigator();

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
]);

export default function homeNavigation() {
    return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName='Home'>
            <Stack.Screen name="ExerciseDetails" options={{headerShown: false}} component={ExerciseDetailsScreens} />
        </Stack.Navigator>
    </NavigationContainer>
    )
}


const styles = StyleSheet.create({})