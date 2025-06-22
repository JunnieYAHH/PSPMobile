import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, StatusBar, ImageBackground, FlatList } from 'react-native';
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
import { useSelector } from 'react-redux';
import LottieView from 'lottie-react-native';
import axios from 'axios';
import baseURL from '../../../../assets/common/baseUrl';

const AdminIndex = () => {
  const router = useRouter();
  const [activeCount, setActiveCount] = useState(0);
  const [activeComponent, setActiveComponent] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const userBranch = user?.user?.userBranch || '';
  console.log(activeCount, 'counts')
  const getActiveLogs = async () => {
    try {
      const data = await getTimedInLogs({ userBranch });
      console.log(data, 'Logs')
      if (data && data.activeLogs) {
        const logsArray = Array.isArray(data.activeLogs) ? data.activeLogs : [data.activeLogs];
        const activeLogsCount = logsArray.filter(log => log.timeOut === null).length;
        setActiveCount(activeLogsCount);
      } else {
        setActiveCount(0);
      }
    } catch (error) {
      // console.error("Error fetching products:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getActiveLogs();
    }, [])
  );

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const animation = useRef(null)
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      const fetchUsers = async () => {
        try {
          const response = await axios.get(`${baseURL}/users/get-all-users`);
          if (isMounted) {
            const adminBranchId = user?.user?.userBranch;

            const filteredUsers = response.data.users.filter(
              (user) => user.role !== "admin" && user.role !== "superadmin" && user.role !== "user" && user.userBranch === adminBranchId
            );

            setUsers(filteredUsers);
            setFilteredUsers(filteredUsers);
          }
        } catch (error) {
          if (isMounted) {
            console.error("Error fetching users:", error);
          }
        }
      };

      fetchUsers();

      return () => {
        isMounted = false;
      };
    }, [])
  );

  const filterUsersByRole = (role) => {
    const filtered = users.filter(user => user.role === role);
    setFilteredUsers(filtered);
  };

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
            <View style={{ backgroundColor: '#CC5500', height: 130, width: 350, borderRadius: 7, marginTop: 10 }}>
              <View style={{ backgroundColor: 'black', height: 115, width: 320, alignSelf: 'center', marginTop: 7, borderRadius: 10 }}>
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
                  <LottieView
                    ref={animation}
                    source={require('../../../../assets/DumbellPress.json')}
                    autoPlay
                    loop
                    style={{ width: 170, height: 100, position: 'absolute', marginLeft: 170 }}
                  />
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
            <View style={styles.ntcontainer}>
              <View style={styles.ntsideNav}>
                <TouchableOpacity style={styles.ntbutton} onPress={() => filterUsersByRole('client')}>
                  <Text style={styles.ntbuttonText}>Clients</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.ntbutton} onPress={() => filterUsersByRole('coach')}>
                  <Text style={styles.ntbuttonText}>Coaches</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.userListContainer}>
                <FlatList
                  data={filteredUsers}
                  keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
                  renderItem={({ item }) => (
                    <View style={styles.userItem}>
                      <View>
                        <Text style={styles.userName}>{item.name}</Text>
                        <Text style={styles.userRole}>{item.role}</Text>
                      </View>
                    </View>
                  )}
                />
              </View>
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
  ntcontainer: { flex: 1, flexDirection: 'row', marginTop: 30 },
  ntbackButton: { marginBottom: 30 },
  ntbutton: {
    backgroundColor: '#FFAC1C',
    paddingVertical: 10,
    marginBottom: 15,
    width: 70,
    borderRadius: 5,
    alignItems: 'center',
  },
  ntbuttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 12,
  },
  userListContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#DD571C',
    borderRadius: 30,
    marginLeft: 20,
    height: '80%'
  },
  userItem: {
    backgroundColor: '#2C2C2C',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',

  },
  userName: {
    color: '#FFAC1C',
    fontSize: 13,
    fontWeight: 'bold',
  },
  userRole: {
    color: 'white',
    fontSize: 11,
    marginTop: 5,
  },
});

export default AdminIndex;