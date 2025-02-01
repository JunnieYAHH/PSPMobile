import React, { useCallback, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import Icon from "react-native-vector-icons/FontAwesome";
import { logoutAction } from '../../../(redux)/authSlice';
import styles from '../../styles/Client/ClientHomeStyles';
import { View, Text, StatusBar, TouchableOpacity, FlatList, Pressable, Image, StyleSheet } from 'react-native';
import LoadingScreen from '../../LodingScreen';
import { SafeAreaView } from 'react-native-safe-area-context';

const ClientIndex = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [screenLoading, setScreenLoading] = useState(false);
  const state = useSelector(state => state.auth);


  return (
    <>
      {screenLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <SafeAreaView>

            <View style={{ padding: 10, }}>
              <Text style={{ fontWeight: 900, fontSize: 16 }}>Client Home</Text>
            </View>
          </SafeAreaView>
        </>
      )}
    </>
  );
};

export default ClientIndex;
