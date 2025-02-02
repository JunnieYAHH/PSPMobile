import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { BarChart, LineChart } from 'react-native-gifted-charts';
import { parseISO, differenceInMinutes, format } from 'date-fns';

const LogCharts = ({ logs }) => {
  const [dailyActivity, setDailyActivity] = useState([]);
  const [userFrequency, setUserFrequency] = useState([]);
  const [averageSession, setAverageSession] = useState([]);
  const [peakHours, setPeakHours] = useState([]);

  useEffect(() => {
    const activityMap = {};
    const userMap = {};
    const sessionMap = {};
    const hourMap = Array(24).fill(0);

    logs.forEach(log => {
      const date = format(parseISO(log.date), 'yyyy-MM-dd');
      const userId = log.userId;
      const timeIn = parseISO(log.timeIn);
      const timeOut = parseISO(log.timeOut);
      const duration = differenceInMinutes(timeOut, timeIn);
      const hour = timeIn.getHours();
      
      // Daily Activity
      activityMap[date] = (activityMap[date] || 0) + 1;
      
      // User Frequency
      userMap[userId] = (userMap[userId] || 0) + 1;
      
      // Average Session
      sessionMap[date] = sessionMap[date] ? [...sessionMap[date], duration] : [duration];
      
      // Peak Hours
      hourMap[hour] += 1;
    });

    setDailyActivity(Object.entries(activityMap).map(([date, count]) => ({ label: date, value: count })));
    setUserFrequency(Object.entries(userMap).map(([user, count]) => ({ label: user, value: count })));
    setAverageSession(Object.entries(sessionMap).map(([date, durations]) => ({ label: date, value: durations.reduce((a, b) => a + b, 0) / durations.length })));
    setPeakHours(hourMap.map((count, index) => ({ label: `${index}:00`, value: count })));
  }, [logs]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Daily Activity</Text>
      <BarChart data={dailyActivity} barWidth={50} />

      <Text style={styles.title}>User Check-in Frequency</Text>
      <BarChart data={userFrequency} barWidth={50} />

      <Text style={styles.title}>Average Session Duration</Text>
      <LineChart data={averageSession} thickness={3} />

      <Text style={styles.title}>Peak Usage Hours</Text>
      <BarChart data={peakHours} barWidth={30} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
});

export default LogCharts;
