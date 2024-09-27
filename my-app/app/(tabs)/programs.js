import { ImageBackground, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Constants from 'expo-constants';

const Programs = () => {
  return (
    <>
    <StatusBar translucent backgroundColor="transparent" />
    <View style={styles.container}>
        <ImageBackground
            source={require('../../assets/HomeBackground.png')}
            style={styles.backgroundImage}
            imageStyle={{ opacity: 1.5 }}
            blurRadius={2}
            resizeMode="stretch" 
        >
          
        </ImageBackground>
    </View>
</>
  )
}

export default Programs

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
})