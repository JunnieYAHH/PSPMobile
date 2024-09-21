import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Constants from 'expo-constants';


const TabHome = () => {
  return (
    <>
      <StatusBar translucent backgroundColor="transparent" />
      <View style={styles.container}>
        <Text>Home</Text>
      </View>
    </>
  )
}

export default TabHome

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
},
})