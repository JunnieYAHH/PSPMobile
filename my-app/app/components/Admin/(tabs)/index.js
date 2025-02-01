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
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Sales from '../components/sales';
import Statistics from '../components/statistics';
import Post from '../components/post';
import Users from '../components/users';

const AdminIndex = () => {
  const router = useRouter();
  const [activeCount, setActiveCount] = useState(0);
  const [activeComponent, setActiveComponent] = useState(null);

  const getActiveLogs = async () => {
    try {
      const data = await getTimedInLogs();
      if (data && data.activeLogs) {
        const logsArray = Array.isArray(data.activeLogs) ? data.activeLogs : [data.activeLogs];
        const activeLogsCount = logsArray.filter(log => log.timeOut === null).length;
        setActiveCount(activeLogsCount);
      } else {
        setActiveCount(0);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

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
                    <TouchableOpacity onPress={() => setActiveComponent('Users')}>
                      <MaterialIcons name="create-new-folder" size={24} color="white" />
                      <Text style={{ color: 'white', fontSize: 8, marginLeft: 2 }}>Users</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setActiveComponent('Sales')}>
                      <MaterialCommunityIcons name="sale" size={24} color="white" />
                      <Text style={{ color: 'white', fontSize: 8, marginLeft: 2 }}>Sales</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                    <TouchableOpacity onPress={() => setActiveComponent('Statistics')}>
                      <AntDesign name="barschart" size={24} color="white" />
                      <Text style={{ color: 'white', fontSize: 8, marginLeft: 2 }}>Stats</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setActiveComponent('Post')}>
                      <MaterialIcons name="post-add" size={24} color="white" />
                      <Text style={{ color: 'white', fontSize: 8, marginLeft: 2 }}>Post</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Conditional rendering */}
          {activeComponent === 'Users' && <Users onBack={() => setActiveComponent(null)} />}
          {activeComponent === 'Sales' && <Sales onBack={() => setActiveComponent(null)} />}
          {activeComponent === 'Statistics' && <Statistics onBack={() => setActiveComponent(null)} />}
          {activeComponent === 'Post' && <Post onBack={() => setActiveComponent(null)} />}

          {/* Default text when nothing is selected */}
          {!activeComponent && (
            <View>
              <Text style={{ color: 'white' }}>HELLO</Text>
            </View>
          )}
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