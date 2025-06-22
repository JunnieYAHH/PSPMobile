import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { BarChart, LineChart } from 'react-native-gifted-charts';
import { parseISO, differenceInMinutes, format } from 'date-fns';
import { BottomSheetModal, BottomSheetView, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import axios from 'axios';
import { useFocusEffect } from 'expo-router';
import baseURL from '../../../../../assets/common/baseUrl';
import { useSelector } from 'react-redux';

const LogCharts = ({ logs }) => {
  const [dailyActivity, setDailyActivity] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const [averageSession, setAverageSession] = useState([]);
  const [peakHours, setPeakHours] = useState([]);
  const [trainingTypes, setTrainingTypes] = useState([]);

  const getTrainingSessions = async () => {
    try {
      const { data } = await axios.get(`${baseURL}/availTrainer`);
      const trainingTypes = data.map(session => session.trainingType).filter(type => type !== undefined);
      setTrainingTypes(trainingTypes);
    } catch (error) {
      console.error("Error fetching training sessions:", error);
    }
  };
  console.log(trainingTypes);

  useFocusEffect(
    useCallback(() => {
      getTrainingSessions();
    }, [])
  )


  //Data
  useEffect(() => {
    const activityMap = {};
    const userMap = {};
    const sessionMap = {};
    const hourMap = Array(24).fill(0);

    logs.forEach(log => {
      if (!log.date || !log.timeIn || !log.timeOut) return; // 🚨 prevent crashing

      const date = format(parseISO(log.date), 'yyyy-MM-dd');
      const userId = log.userId;
      const timeIn = parseISO(log.timeIn);
      const timeOut = parseISO(log.timeOut);
      const duration = differenceInMinutes(timeOut, timeIn);
      const hour = timeIn.getHours();

      activityMap[date] = (activityMap[date] || 0) + 1;
      userMap[userId] = (userMap[userId] || 0) + 1;
      sessionMap[date] = sessionMap[date] ? [...sessionMap[date], duration] : [duration];
      hourMap[hour] += 1;
    });

    setDailyActivity(
      Object.entries(activityMap).map(([date, count]) => ({
        label: format(parseISO(date), 'MMMM dd, yyyy'),
        value: count
      }))
    );

    setAverageSession(
      Object.entries(sessionMap)
        .filter(([_, durations]) => durations.some((d) => d > 0))
        .map(([date, durations]) => ({
          label: format(parseISO(date), 'MMMM dd, yyyy'),
          value: parseFloat((durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(2)),
          labelTextStyle: { color: 'black' },
          color: 'black'
        }))
    );

    setPeakHours(
      hourMap
        .map((count, index) => {
          const period = index >= 12 ? 'PM' : 'AM';
          const hour = index % 12 || 12;
          return {
            label: `${hour}:00 ${period}`,
            value: count
          };
        })
        .filter(item => item.value > 0)
    );
  }, [logs]);

  // Create separate modal refs
  const dailyActivityModalRef = useRef(null);
  const averageSessionModalRef = useRef(null);
  const peakHoursModalRef = useRef(null);

  return (
    <ScrollView style={styles.container}>
      <View style={{ backgroundColor: 'black', padding: 20, borderRadius: 10, marginTop: 10, marginBottom: 25 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.title}>Daily Activity</Text>
          <TouchableOpacity onPress={() => dailyActivityModalRef.current?.present()}>
            <Text style={{ textAlign: 'right', color: '#FFAC1C' }}>
              See more -{'>'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ backgroundColor: 'white', padding: 10, borderRadius: 20 }}>
          <BarChart data={dailyActivity} barWidth={40} spacing={10} width={500} hideRules
            yAxisThickness={0}
            xAxisThickness={2}
            xAxisLabelTextStyle={{ color: 'black' }}
            yAxisLabelTextStyle={{ color: 'black' }}
          />
        </View>
      </View>

      <View style={{ backgroundColor: 'black', padding: 20, borderRadius: 10, marginBottom: 25 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.title}>Average Session Duration</Text>
          <TouchableOpacity onPress={() => averageSessionModalRef.current?.present()}>
            <Text style={{ textAlign: 'right', color: '#FFAC1C' }}>
              See more -{'>'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ backgroundColor: 'white', padding: 10, borderRadius: 20 }}>
          <LineChart data={averageSession} thickness={3} width={500} hideRules curved hideDataPoints
            xAxisLabelTextStyle={{ color: 'black' }}
            yAxisLabelTextStyle={{ color: 'black' }}
            dataPointsColor={'black'}
            textColor="black"
            color="black"
          />
        </View>
      </View>

      <View style={{ backgroundColor: 'black', padding: 20, borderRadius: 10, marginBottom: 25 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.title}>Peak Usage Hours</Text>
          <TouchableOpacity onPress={() => peakHoursModalRef.current?.present()}>
            <Text style={{ textAlign: 'right', color: '#FFAC1C' }}>
              See more -{'>'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ backgroundColor: 'white', padding: 10, borderRadius: 20 }}>
          <BarChart data={peakHours} barWidth={30} spacing={8} width={500}
            hideRules
            yAxisThickness={0}
            xAxisThickness={2}
            xAxisLabelTextStyle={{ color: 'black' }}
            yAxisLabelTextStyle={{ color: 'black' }}
          />
        </View>
      </View>

      <BottomSheetModal ref={dailyActivityModalRef} index={0} snapPoints={['50%']}>
        <BottomSheetView style={[styles.modalContent, { backgroundColor: '#FFD700' }]}>
          <Text style={[styles.modalTitle, { color: 'black' }]}>Daily Activity</Text>
          <FlatList
            data={dailyActivity}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <Text style={styles.modalItem}>{`${item.label}: ${item.value}`}</Text>}
          />
        </BottomSheetView>
      </BottomSheetModal>

      <BottomSheetModal ref={averageSessionModalRef} index={0} snapPoints={['50%']}>
        <BottomSheetView style={[styles.modalContent, { backgroundColor: '#32CD32' }]}>
          <Text style={[styles.modalTitle, { color: 'black' }]}>Average Session Duration</Text>
          <FlatList
            data={averageSession}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <Text style={styles.modalItem}>{`${item.label}: ${item.value} min/s`}</Text>}
          />
        </BottomSheetView>
      </BottomSheetModal>

      <BottomSheetModal ref={peakHoursModalRef} index={0} snapPoints={['50%']}>
        <BottomSheetView style={[styles.modalContent, { backgroundColor: '#FF4500' }]}>
          <Text style={[styles.modalTitle, { color: 'white' }]}>Peak Usage Hours</Text>
          <FlatList
            data={peakHours}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <Text style={styles.modalItem}>{`${item.label}: ${item.value}`}</Text>}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </ScrollView >
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', height: '100%' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: 'white' },
  chartContainer: { backgroundColor: 'black', padding: 20, borderRadius: 10, marginVertical: 10 },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  seeMore: { textAlign: 'right', color: '#FFAC1C' },
  modalContent: { padding: 20, borderRadius: 15 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  modalItem: { fontSize: 16, paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: '#ddd' }
});

export default LogCharts;