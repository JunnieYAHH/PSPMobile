import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import Icon from "react-native-vector-icons/FontAwesome";
import { logoutAction } from '../../../(redux)/authSlice';
import styles from '../../styles/Client/ClientHomeStyles';
import { View, Text, StatusBar, TouchableOpacity } from 'react-native';
import LoadingScreen from '../../LodingScreen';

const ClientIndex = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [screenLoading, setScreenLoading] = useState(false);


  const handleLogout = () => {
    dispatch(logoutAction());
    router.push("/auth/login");
  };
  return (
    <>
      {screenLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <StatusBar translucent backgroundColor="transparent" />
          <View style={styles.container}>
            <View>
              <Text>Client Index Screen</Text>
            </View>
          </View>
        </>
      )}
    </>
  );
};

export default ClientIndex;
