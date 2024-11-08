import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, StatusBar, ImageBackground } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Constants from 'expo-constants';
import { getUserData } from '../../../(services)/api/Admin/scanLogIn';

const AdminIndex = () => {
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <ImageBackground
        source={require('../../../../assets/ProgramBG.png')}
        style={styles.backgroundImage}
        imageStyle={{ opacity: 2.0 }}
        blurRadius={2}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.dashboardContainer}>
            <Text style={styles.pspText}>PSP</Text>
            <Text style={styles.dashboardText}>DASHBOARD</Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    marginTop: 40,
    padding: 16,
  },
  dashboardContainer: {
    flexDirection: 'column',
  },
  pspText: {
    fontSize: 50,
    color: '#FFAC1C',
    fontStyle: 'italic',
    transform: [{ skewX: '-10deg' }],
  },
  dashboardText: {
    fontSize: 40,
    color: 'white',
    fontStyle: 'italic',
    transform: [{ skewX: '-10deg' }],
  },
});

export default AdminIndex;