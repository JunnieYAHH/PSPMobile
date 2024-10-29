import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { logoutAction } from '../../../(redux)/authSlice';
import LoadingScreen from '../../LodingScreen';
import { useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';


const CoachIndex = () => {
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
          <View style={{ marginTop: 50, marginLeft: 20 }}>
            <Text>CoachIndex</Text>
          </View>
        </>
      )}
    </>
  )
}

export default CoachIndex