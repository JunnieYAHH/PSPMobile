import {
  View,
  Text,
  StatusBar,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal
} from 'react-native';
import React, { useCallback, useState } from 'react';
import Constants from 'expo-constants';
import axios from 'axios';
import baseURL from '../../../../assets/common/baseUrl';
import { useFocusEffect, useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { Agenda } from 'react-native-calendars';

export default function TrainingSessions() {
  const [trainingSessions, setTrainingSessions] = useState([]);
  const [agendaItems, setAgendaItems] = useState({});
  const [showCalendar, setShowCalendar] = useState(false);
  const [sessionFilter, setSessionFilter] = useState('active'); // 👈 active or inactive

  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const userBranch = user?.user?.userBranch || '';

  const getTrainingSessions = async () => {
    try {
      const { data } = await axios.post(`${baseURL}/availTrainer`, { userBranch });
      setTrainingSessions(data);
      const agendaData = generateAgendaItems(data);
      setAgendaItems(agendaData);
    } catch (error) {
      console.error("Error fetching training sessions:", error);
    }
  };

  const generateAgendaItems = (sessions) => {
    const agenda = {};

    sessions.forEach((session) => {
      session.schedule.forEach((sched, index) => {
        if (sched.status === 'waiting' && sched.dateAssigned) {
          const rawDate = new Date(sched.dateAssigned);
          const rawTime = new Date(sched.timeAssigned);

          const combined = new Date(
            rawDate.getFullYear(),
            rawDate.getMonth(),
            rawDate.getDate(),
            rawTime.getHours(),
            rawTime.getMinutes()
          );

          // ✅ Manually adjust to Asia/Manila (UTC+8)
          const phTime = new Date(combined.getTime() + 16 * 60 * 60 * 1000);

          const dateStr = phTime.toISOString().split('T')[0]; // 'YYYY-MM-DD'

          const timeStr = phTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });

          if (!agenda[dateStr]) agenda[dateStr] = [];

          agenda[dateStr].push({
            name: `${session.name} - Session ${index + 1}`,
            coach: session.coachID?.email || 'Unassigned',
            time: timeStr,
            trainings: sched.trainings?.join(', ') || 'N/A',
            color: stringToColor(session.email || session.name || 'default'),
            status: sched.status,
          });
        }
      });
    });

    return agenda;
  };

  useFocusEffect(
    useCallback(() => {
      getTrainingSessions();
    }, [])
  );

  const renderItem = (item) => (
    <View style={[styles.agendaItem, { backgroundColor: item.color || '#28282B' }]}>
      <Text style={[styles.itemText, { color: 'white' }]}>{item.name}</Text>
      <Text style={[styles.subText, { color: 'white' }]}>Time: {item.time}</Text>
      <Text style={[styles.subText, { color: 'white' }]}>Coach: {item.coach}</Text>
      <Text style={[styles.subText, { color: 'white' }]}>Trainings: {item.trainings}</Text>
      <Text style={[styles.subText, { color: 'white' }]}>Status: {item.status}</Text>
    </View>
  );

  const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = '#' + ((hash >> 24) & 0xFF).toString(16).padStart(2, '0') +
      ((hash >> 16) & 0xFF).toString(16).padStart(2, '0') +
      ((hash >> 8) & 0xFF).toString(16).padStart(2, '0');
    return color.slice(0, 7);
  };

  const filteredSessions = trainingSessions.filter(session =>
    session.status?.toLowerCase() === sessionFilter
  );

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <ImageBackground
        source={require('../../../../assets/ProgramBG.png')}
        style={styles.backgroundImage}
        blurRadius={2}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <Text style={styles.headerTitle}>Availed/Availing Sessions</Text>

          <View style={styles.sessionContainer}>
            <Text style={styles.sessionTitle}>PSP Training Sessions</Text>

            {/* Filter Buttons */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tabButton, sessionFilter === 'active' && styles.activeTab]}
                onPress={() => setSessionFilter('active')}
              >
                <Text style={styles.tabText}>Active</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabButton, sessionFilter === 'inactive' && styles.activeTab]}
                onPress={() => setSessionFilter('inactive')}
              >
                <Text style={styles.tabText}>Inactive</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.calendarButton} onPress={() => setShowCalendar(true)}>
              <Text style={styles.calendarButtonText}>🗓️ View Coach Calendar</Text>
            </TouchableOpacity>

            <FlatList
              style={{ height: 600 }}
              data={filteredSessions}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => <SessionCard item={item} />}
              contentContainerStyle={{ paddingBottom: 20 }}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </ImageBackground>

      {/* Agenda Modal */}
      <Modal visible={showCalendar} animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'black' }}>
          <Agenda
            items={agendaItems}
            selected={Object.keys(agendaItems)[0] || new Date().toISOString().split('T')[0]}
            renderItem={renderItem}
            showOnlySelectedDayItems={false}
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
          />
          <TouchableOpacity onPress={() => setShowCalendar(false)} style={styles.closeBtn}>
            <Text style={styles.closeText}>Close Calendar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const SessionCard = ({ item }) => {
  const router = useRouter();
  const navigateToSession = () => {
    router.push({
      pathname: '/components/Admin/components/view-training-session',
      params: { id: item._id }
    });
  };

  const statusColor = !item.coachID
    ? "blue"
    : item.status?.toLowerCase() === "active"
      ? "green"
      : "gray";

  const coachText = item.coachID ? item.coachID.email : "Assign a Coach!!";

  return (
    <TouchableOpacity onPress={navigateToSession} activeOpacity={0.7}>
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Text style={styles.cardText}>
            <Text style={{ fontWeight: 'bold', fontSize: 17 }}>Client: </Text>
            {item?.email || "Unknown"}
          </Text>
          <Text style={styles.cardText}>
            <Text style={{ fontWeight: 'bold', fontSize: 17 }}>Coach: </Text>
            {coachText}
          </Text>
          <Text style={styles.cardText}>
            <Text style={{ fontWeight: 'bold', fontSize: 17 }}>Package: </Text>
            {item?.package || "N/A"}
          </Text>
        </View>
        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    padding: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  sessionContainer: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  sessionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  calendarButton: {
    backgroundColor: '#FFAC1C',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  calendarButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeBtn: {
    backgroundColor: 'orange',
    padding: 10,
    alignItems: 'center',
  },
  closeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  agendaItem: {
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
    marginTop: 10,
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 14,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'center',
    gap: 10,
  },
  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: 15,
    backgroundColor: '#ddd',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#FFAC1C',
  },
  tabText: {
    fontWeight: 'bold',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#eee',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
  },
  cardText: {
    color: 'black',
    marginBottom: 4,
  },
  statusDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
});