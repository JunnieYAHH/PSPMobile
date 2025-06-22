import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ScrollView,
  FlatList,
  Pressable,
  Image,
} from 'react-native';
import { Agenda } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useFocusEffect, useRouter } from 'expo-router';
import axios from 'axios';
import baseURL from '../../../../assets/common/baseUrl';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoadingScreen from '../../LodingScreen';

const Schedule = () => {
  const router = useRouter();
  const [screenLoading, setScreenLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [agendaVisible, setAgendaVisible] = useState(false);
  const [sessionType, setSessionType] = useState('active');
  const state = useSelector((state) => state.auth);

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

  const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = '#' +
      ((hash >> 24) & 0xFF).toString(16).padStart(2, '0') +
      ((hash >> 16) & 0xFF).toString(16).padStart(2, '0') +
      ((hash >> 8) & 0xFF).toString(16).padStart(2, '0');
    return color.length === 7 ? color : '#FFAC1C';
  };
  const prepareAgendaItems = () => {
    const items = {};

    clients.forEach((client) => {
      client.schedule?.forEach((s) => {
        const isActive = s.status === 'waiting'; // define active vs inactive
        if (s.dateAssigned && ((sessionType === 'active' && isActive) || (sessionType === 'inactive' && !isActive))) {
          const date = new Date(s.dateAssigned).toISOString().split('T')[0];
          if (!items[date]) items[date] = [];
          items[date].push({
            name: client.name,
            time: s.timeAssigned?.split('T')[1]?.substring(0, 5) || 'Not set',
            trainings: s.trainings?.join(', ') || 'None',
            color: stringToColor(client.email || client.name || 'default'),
            status: s.status,
          });
        }
      });
    });

    return items;
  };
  const agendaItems = useMemo(() => prepareAgendaItems(), [clients, sessionType]);

  const renderItem = (item) => (
    <View style={[styles.agendaItem, { backgroundColor: item.color }]}>
      <Text style={[styles.itemText, { color: 'white' }]}>{item.name}</Text>
      <Text style={[styles.subText, { color: 'white' }]}>Time: {item.time}</Text>
      <Text style={[styles.subText, { color: 'white' }]}>Coach: {item.coach}</Text>
      <Text style={[styles.subText, { color: 'white' }]}>Trainings: {item.trainings}</Text>
      <Text style={[styles.subText, { color: 'white' }]}>Status: {item.status}</Text>
    </View>
  );


  return (
    <>
      {screenLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <SafeAreaView style={styles.safeArea}>
            
            <ImageBackground
              source={require('../../../../assets/ProgramBG.png')}
              style={styles.backgroundImage}
              imageStyle={{ opacity: 2.0 }}
              blurRadius={2}
              resizeMode="cover"
            >

              {/* Header with Burger Icon */}
              <View style={styles.header}>
                <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
                  <Ionicons name="menu" size={30} color="black" />
                </TouchableOpacity>

                {/* Menu */}
                {menuVisible && (
                  <View style={styles.menu}>
                    <Pressable onPress={() => router.push('/components/Coach/screens/statistics')}>
                      <Text style={styles.menuItem}>Statistics</Text>
                    </Pressable>
                    <Text style={{ marginTop: 4 }}>||</Text>
                    <TouchableOpacity onPress={() => setAgendaVisible(true)}>
                      <Text style={styles.menuItem}>Schedules</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>


              {/* Main content */}
              <View style={styles.contentContainer}>
                <Text style={styles.headerText}>Your Clients</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 5 }}>
                  <TouchableOpacity
                    onPress={() => setSessionType('active')}
                    style={{
                      padding: 10,
                      backgroundColor: sessionType === 'active' ? '#1E90FF' : 'gray',
                      borderRadius: 5,
                      marginRight: 10
                    }}
                  >
                    <Text style={{ color: 'white' }}>Active</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setSessionType('inactive')}
                    style={{
                      padding: 10,
                      backgroundColor: sessionType === 'inactive' ? '#1E90FF' : 'gray',
                      borderRadius: 5
                    }}
                  >
                    <Text style={{ color: 'white' }}>Inactive</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ marginTop: 10 }}>
                  <ClientLists users={clients} sessionType={sessionType} />
                </View>
              </View>

              {/* Modal Agenda */}
              <Modal
                visible={agendaVisible}
                animationType="slide"
                onRequestClose={() => setAgendaVisible(false)}
                style={{ backgroundColor: '#FFAC1C' }}
              >
                <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
                  <Agenda
                    items={agendaItems}
                    refreshing={false}
                    renderItem={renderItem}
                    theme={{
                      backgroundColor: 'black',
                      calendarBackground: 'black',
                      agendaBackgroundColor: 'black',
                      dayTextColor: 'white',
                      textSectionTitleColor: 'white',
                      selectedDayBackgroundColor: '#1E90FF',
                      selectedDayTextColor: 'white',
                      todayTextColor: 'orange',
                      agendaKnobColor: 'white',
                    }}
                    contentStyle={{
                      backgroundColor: '#f4f4f4',
                    }}
                    renderEmptyDate={() => (
                      <View style={styles.emptyDate}>
                        <Text>No sessions.</Text>
                      </View>
                    )}
                  />
                  <TouchableOpacity onPress={() => setAgendaVisible(false)} style={styles.closeBtn}>
                    <Text style={styles.closeText}>Close Calendar</Text>
                  </TouchableOpacity>
                </SafeAreaView>
              </Modal>
            </ImageBackground>
          </SafeAreaView>
        </>
      )}
    </>
  );
};

const ClientLists = ({ users, sessionType }) => {
  const filteredUsers = users.filter((user) => user.status === sessionType);

  const isToday = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    date.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return date.getTime() === today.getTime();
  };

  const getNextSchedule = (client) => {
    return client.schedule
      ?.filter((s) => s.status === 'active')
      .sort((a, b) => new Date(a.dateAssigned) - new Date(b.dateAssigned))[0];
  };

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const nextA = getNextSchedule(a);
    const nextB = getNextSchedule(b);

    const isTodayA = nextA && isToday(nextA.dateAssigned);
    const isTodayB = nextB && isToday(nextB.dateAssigned);

    if (isTodayA && !isTodayB) return -1;
    if (!isTodayA && isTodayB) return 1;
    if (isTodayA && isTodayB) {
      return new Date(nextA.dateAssigned) - new Date(nextB.dateAssigned);
    }
    return 0;
  });

  return (
    <View>
      <View style={{ backgroundColor: '#FFAC1C', padding: 10, borderRadius: 20 }}>
        <FlatList
          data={sortedUsers}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <ClientServiceDetail item={item} />}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginVertical: 20 }}>
              No {sessionType} clients found.
            </Text>
          }
        />
      </View>
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
    backgroundColor: '#353839'
  },
  header: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFAC1C',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  menu: {
    backgroundColor: '#fff',
    padding: 2,
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
    padding: 5,
    fontSize: 14,
  },
  contentContainer: {
    flex: 1,
    padding: 15,
    zIndex: 1,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center'
  },
  clientDetail: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
  },
  modalHeader: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  agendaItem: {
    backgroundColor: '#FFAC1C',
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  emptyDate: {
    height: 50,
    flex: 1,
    paddingTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtn: {
    backgroundColor: 'orange',
    padding: 10,
    alignItems: 'center',
  },
});

export default Schedule;