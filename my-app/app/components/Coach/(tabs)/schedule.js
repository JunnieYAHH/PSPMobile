import { View, Text, Image, Pressable, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import React, { useCallback, useState } from 'react';
import { logoutAction } from '../../../(redux)/authSlice';
import LoadingScreen from '../../LodingScreen';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect, useRouter } from 'expo-router';
import axios from 'axios';
import baseURL from '../../../../assets/common/baseUrl';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

const Schedule = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [screenLoading, setScreenLoading] = useState(false);
  const state = useSelector((state) => state.auth);
  const [clients, setClients] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const handleLogout = () => {
    dispatch(logoutAction());
    router.push('/auth/login');
  };

  const getCoachClients = async () => {
    setScreenLoading(true);
    const {
      user: { user },
    } = state;

    try {
      const { data } = await axios.get(`${baseURL}/availTrainer/coach/${user._id}`);
      setClients(data);
    } catch (err) {
      console.log(err);
    }
    setScreenLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      getCoachClients();
    }, [])
  );

  return (
    <>
      {screenLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <SafeAreaView style={styles.safeArea}>
            {/* Header with Burger Icon */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
                <Ionicons name="menu" size={30} color="black" />
              </TouchableOpacity>

              {/* Menu */}
              {menuVisible && (
                <View style={styles.menu}>
                  <Pressable onPress={() => router.push('/components/Coach/screens/service-client-details')}>
                    <Text style={styles.menuItem}>Clients</Text>
                  </Pressable>
                  <Pressable onPress={() => router.push('/components/Coach/screens/statistics')}>
                    <Text style={styles.menuItem}>Statistics</Text>
                  </Pressable>
                  <Pressable onPress={() => router.push('/components/Coach/screens/schedule')}>
                    <Text style={styles.menuItem}>Schedules</Text>
                  </Pressable>
                </View>
              )}
            </View>

            {/* Main content */}
            <View style={styles.contentContainer}>
              <Text style={styles.headerText}>Your Clients</Text>
              <View style={{ marginTop: 10 }}>
                <ClientLists users={clients} />
              </View>
            </View>
          </SafeAreaView>
        </>
      )}
    </>
  );
};

const ClientLists = ({ users }) => {
  return (
    <View>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <ClientServiceDetail item={item} />}
      />
    </View>
  );
};

const ClientServiceDetail = ({ item }) => {
  const router = useRouter();
  const [completedSession, setCompletedSession] = useState(0);
  const [nextSchedule, setNextSchedule] = useState(null);

  const { user } = useSelector((state) => state.auth);

  const goToDetail = () => {
    router.push({
      pathname: '/components/Coach/screens/service-client-details',
      params: { id: item._id },
    });
  };

  useFocusEffect(
    useCallback(() => {
      const countCompleted = item.schedule.reduce((count, scheduleItem) => {
        return scheduleItem.status === 'completed' ? count + 1 : count;
      }, 0);
      setCompletedSession(countCompleted);

      const upcomingSchedule = item.schedule
        .filter((scheduleItem) => scheduleItem.status === 'waiting')
        .sort((a, b) => new Date(a.dateAssigned) - new Date(b.dateAssigned))[0];
      setNextSchedule(upcomingSchedule);
    }, [item.schedule])
  );

  const isSameDate = (dateString) => {
    const scheduleDate = new Date(dateString);
    const today = new Date();

    scheduleDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return scheduleDate.getTime() === today.getTime();
  };

  return (
    <Pressable onPress={goToDetail}>
      <View style={styles.clientDetail}>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
          <Image height={65} width={65} borderRadius={5} source={{ uri: item.userId.image[0].url }} />
          <View style={{ alignSelf: 'center' }}>
            <Text>Name: {item.userId.name}</Text>
            <Text>Email: {item.userId.email}</Text>
            <Text>Phone: {item.userId.phone}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Text>{item.package}</Text>
          <Text> | </Text>
          <Text>
            {completedSession}/{item.sessions} Sessions
          </Text>
          <Text> | </Text>
          <Text>P{item.sessionRate} Rate</Text>
        </View>

        <View style={{ marginTop: 5, flexDirection: 'row', gap: 10 }}>
          <Text>Status: {item.status}</Text>
          <Text> | </Text>
          <Text
            style={{
              color: nextSchedule && isSameDate(nextSchedule.dateAssigned) ? 'green' : 'black',
            }}
          >
            Next Schedule: {nextSchedule ? formatDate(nextSchedule.dateAssigned) : 'No upcoming schedule'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

function formatDate(dateString) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return 'Not Specified';
  }

  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options).replace(',', '');
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  menu: {
    backgroundColor: '#fff',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'row'
  },
  menuItem: {
    padding: 10,
    fontSize: 16,
  },
  contentContainer: {
    flex: 1,
    padding: 15,
    zIndex: 1,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  clientDetail: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
  },
});

export default Schedule;