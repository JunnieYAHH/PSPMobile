import React from 'react';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import Icon from "react-native-vector-icons/FontAwesome";
import { logoutAction } from '../../../(redux)/authSlice';
import styles from '../../styles/Client/ClientHomeStyles';
import { View, Text, StatusBar, TouchableOpacity } from 'react-native';

const ClientIndex = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  // const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutAction());
    router.push("/auth/login");
  };
  return (
    <>
      <StatusBar translucent backgroundColor="transparent" />
      <View style={styles.container}>
        <View>
          <Text>Client Index Screen</Text>
          <TouchableOpacity style={styles.option} onPress={handleLogout}>
            <Icon name="sign-out" size={24} color="#e91e63" />
            <Text style={styles.optionText}>Logout</Text>
            <Icon
              name="angle-right"
              size={24}
              color="#999"
              style={styles.optionIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default ClientIndex;
