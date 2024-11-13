import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, StatusBar, ImageBackground } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Constants from 'expo-constants';
import { getUserData } from '../../../(services)/api/Admin/scanLogIn';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { getTimedInLogs } from '../../../(services)/api/Users/getTimedInLogs';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';

const AdminIndex = () => {
  const router = useRouter()
  const [activeCount, setActiveCount] = useState(0);

  const getActiveLogs = async () => {
    try {
      const data = await getTimedInLogs();
      if (data && data.activeLogs) {
        const logsArray = Array.isArray(data.activeLogs) ? data.activeLogs : [data.activeLogs];

        // Count only logs that are still active (e.g., timeOut is null)
        const activeLogsCount = logsArray.filter(log => log.timeOut === null).length;
        setActiveCount(activeLogsCount);
      } else {
        setActiveCount(0);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  // console.log(activeCount)

  useFocusEffect(
    useCallback(() => {
      getActiveLogs();
    }, [])
  );

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
          <View style={{ flexDirection: 'row' }}>
            <View style={{ backgroundColor: '#CC5500', height: 130, width: 200, borderRadius: 7, marginTop: 10 }}>
              <View style={{ backgroundColor: 'black', height: 115, width: 180, alignSelf: 'center', marginTop: 7, borderRadius: 10 }}>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ padding: 10 }}>
                    <View style={{ backgroundColor: '#FFAC1C', height: 60, width: 65, padding: 2, borderRadius: 40 }}>
                      <View style={{ backgroundColor: 'black', height: 50, width: 57, padding: 10, borderRadius: 70, marginTop: 3, marginLeft: 2 }}>
                        <FontAwesome6 name="user-clock" size={30} color="white" />
                      </View>
                    </View>
                    <View style={{ marginTop: 5, marginLeft: 6 }}>
                      <Text style={{ color: '#FFBF00', fontSize: 24 }}>{activeCount} <Text style={{ color: 'white', fontSize: 24 }}>/ ???</Text></Text>
                    </View>
                  </View>
                  <View style={{ alignItems: 'center', marginTop: 25 }}>
                    <Text style={{ color: 'white', fontSize: 15, fontStyle: 'italic' }}>Current User/s</Text>
                    <Text style={{ color: '#FFBF00', fontSize: 16, fontWeight: 'bold', fontStyle: 'italic', marginTop: 5 }}>AT GYM</Text>
                    <TouchableOpacity style={{ marginTop: 35, marginLeft: 18 }}
                      onPress={() => router.push("/components/Admin/components/userLogs")}
                    >
                      <Text style={{ color: 'white', fontSize: 10 }}> ----- See More</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
            <View style={{ backgroundColor: '#CC5500', height: 130, width: 150, borderRadius: 7, marginTop: 10, marginLeft: 10 }}>
              <View style={{ backgroundColor: 'black', height: 120, width: 140, alignSelf: 'center', marginTop: 5, borderRadius: 20 }}>
                <View style={{ padding: 15 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                    <Text style={{ color: 'white' }}>Hello</Text>
                    <Text style={{ color: 'white' }}>Hello</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 40 }}>
                    <Text style={{ color: 'white' }}>Hello</Text>
                    <Text style={{ color: 'white' }}>Hello</Text>
                  </View>
                </View>
              </View>
            </View>
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