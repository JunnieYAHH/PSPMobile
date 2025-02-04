import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useCallback, useState } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useFocusEffect } from 'expo-router';
import axios from 'axios';
import baseURL from '../../../../assets/common/baseUrl';
import LogCharts from './statistics/LogCharts';

const Statistics = ({ onBack }) => {
    const [logs, setLogs] = useState([]);

    useFocusEffect(
        useCallback(() => {
            let isMounted = true;

            const fetchLogs = async () => {
                try {
                    const response = await axios.get(`${baseURL}/logs/get-all-logs`);
                    if (isMounted) {
                        setLogs(response.data.logs); // Ensure logs are set
                    }
                } catch (error) {
                    if (isMounted) {
                        console.error("Error fetching logs:", error);
                    }
                }
            };

            fetchLogs();

            return () => {
                isMounted = false;
            };
        }, [])
    );

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', marginTop: 40, width: '100%', marginBottom: 10 }}>
                <TouchableOpacity onPress={onBack} style={{ justifyContent: 'space-between' }}>
                    <AntDesign name="back" size={20} color='#FFAC1C' />
                </TouchableOpacity>
                <Text style={styles.title}>Statistics</Text>
            </View>
            <View style={{ flex: 1, width: '100%', }}>
                {logs.length > 0 ? <LogCharts logs={logs} /> : <Text>Loading data...</Text>}
            </View>
        </View>
    );
};

export default Statistics;

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    // backButton: {
    //     position: 'absolute', top: 40, left: 20, padding: 10, borderRadius: 5,
    // },
    title: { fontSize: 24, fontWeight: 'bold', color: 'white', marginLeft: 115 },
});