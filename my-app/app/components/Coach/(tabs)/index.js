import { View, Text, Image, Pressable } from 'react-native'
import React, { useCallback, useState } from 'react'
import { logoutAction } from '../../../(redux)/authSlice';
import LoadingScreen from '../../LodingScreen';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';


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
          <SafeAreaView>
            <View style={{ padding: 15, }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Coach Home</Text>
            </View>
          </SafeAreaView>
        </>
      )}
    </>
  )
}


export default CoachIndex