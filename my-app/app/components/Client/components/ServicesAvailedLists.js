import React, { useCallback, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import Icon from "react-native-vector-icons/FontAwesome";
import { logoutAction } from '../../../(redux)/authSlice';
import styles from '../../styles/Client/ClientHomeStyles';
import { View, Text, StatusBar, TouchableOpacity, FlatList, Pressable, Image, StyleSheet, Modal } from 'react-native';
import LoadingScreen from '../../LodingScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import baseURL from '../../../../assets/common/baseUrl';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Agenda } from 'react-native-calendars';

export default function ServicesAvailedLists() {

    const state = useSelector(state => state.auth);
    const user = useSelector((state) => state.auth.user);
    const userId = user?.user?._id || user?._id
    const [screenLoading, setScreenLoading] = useState(false);
    const [services, setServices] = useState([]);
    const [agendaItems, setAgendaItems] = useState({});
    const [showCalendar, setShowCalendar] = useState(false);

    const getAvailedServices = async () => {
        try {
            const { data } = await axios.get(`${baseURL}/availTrainer/client/${userId}`);
            setServices(data);

            const items = {};

            if (data.length > 0) {
                data.forEach((service) => {
                    service.schedule.forEach((sched) => {
                        if (!sched.timeAssigned) return;

                        const date = new Date(sched.timeAssigned).toISOString().split('T')[0];
                        if (!items[date]) items[date] = [];

                        items[date].push({
                            name: `Training with ${service.coachID?.name || 'N/A'}`,
                            time: new Date(sched.timeAssigned).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            trainings: service.package,
                            coach: service.coachID?.email,
                            color: '#2ba84a',
                        });
                    });
                });
            }

            // 💡 Always set at least one valid date with an empty array
            const today = new Date().toISOString().split('T')[0];
            if (Object.keys(items).length === 0) {
                items[today] = []; // <- ensures Agenda won't crash
            }

            setAgendaItems(items);
        } catch (err) {
            console.log('getAvailedServices error:', err);
        }
    };

    useFocusEffect(
        useCallback(() => {
            getAvailedServices();
        }, [])
    );

    const renderItem = (item) => (
        <View style={{ backgroundColor: "#FFAC1A", padding: 10, borderRadius: 10, marginRight: 10, marginTop: 10 }}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>{item.name}</Text>
            <Text style={{ color: 'white' }}>Time: {item.time}</Text>
            <Text style={{ color: 'white' }}>Coach: {item.coach}</Text>
            <Text style={{ color: 'white' }}>Training: {item.trainings}</Text>
        </View>
    );

    return (
        <>
            {screenLoading ?
                <View>
                    <Text>Loading...</Text>
                </View>
                :
                <View>
                    <TouchableOpacity
                        onPress={() => setShowCalendar(true)}
                        style={{ backgroundColor: '#FFAC1A', padding: 10, borderRadius: 10, margin: 10 }}
                    >
                        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>View Schedules Calendar</Text>
                    </TouchableOpacity>

                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={services}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => <ServiceDetail item={item} />}
                    />

                    <Modal visible={showCalendar} animationType="slide">
                        <View style={{ flex: 1, backgroundColor: 'black' }}>
                            <Agenda
                                items={agendaItems}
                                selected={
                                    Object.keys(agendaItems).length > 0
                                        ? Object.keys(agendaItems)[0]
                                        : new Date().toISOString().split('T')[0]
                                }
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
                            <TouchableOpacity onPress={() => setShowCalendar(false)} style={{
                                backgroundColor: 'orange',
                                padding: 10,
                                alignItems: 'center',
                            }}>
                                <Text style={styles.closeText}>Close Calendar</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                </View>
            }
        </>
    )

}

const ServiceDetail = ({ item }) => {

    const router = useRouter();
    const [completedSession, setCompletedSession] = useState(0);

    const user = useSelector((state) => state.auth.user);
    const userId = user?.user?._id || user?._id

    useFocusEffect(
        useCallback(() => {

            const countCompleted = item.schedule.reduce((count, item) => {
                return item.status === "completed" ? count + 1 : count;
            }, 0);
            setCompletedSession(countCompleted);

        }, [])
    )

    return (
        <Pressable>
            <View style={{ padding: 10, borderRadius: 10, borderWidth: 1, borderColor: 'white', }} >
                <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10, }}>
                    {item?.coachID?.image[0]?.url ? (
                        <Image height={65} width={65} borderRadius={5} source={{ uri: item?.coachID?.image[0]?.url }} />
                    ) : (
                        <>
                            <Image height={65} width={65} borderRadius={5} source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541' }} />
                        </>
                    )}
                    <View style={{ alignSelf: 'center' }}>
                        <Text style={{ color: 'white' }}>Coach: {item?.coachID?.name || "Not specified"}</Text>
                        <Text style={{ color: 'white' }}>Email: {item?.coachID?.email || "Not specified"}</Text>
                        <Text style={{ color: 'white' }}>Phone: {item?.coachID?.phone || "Not specified"}</Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => {
                            router.push({
                                pathname: '/components/Client/Chat/ChatRoom',
                                params: {
                                    userId: userId,
                                    receiverId: item?.coachID?._id,
                                },
                            });
                        }}
                        style={{ padding: 8 }}
                    >
                        <FontAwesome name="comments" size={24} color="white" />
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <Text style={{ color: 'white' }}>
                        {item.package}
                    </Text>

                    <Text style={{ color: 'white' }} >
                        |
                    </Text>

                    <Text style={{ color: 'white' }}>
                        {completedSession}/{item.sessions} Sessions
                    </Text>

                    <Text style={{ color: 'white' }}>
                        |
                    </Text>

                    <Text style={{ color: 'white' }}>
                        P{item.sessionRate} Rate
                    </Text>
                </View>

                <View style={{ marginTop: 5, flexDirection: 'row', gap: 10 }}>
                    <Text style={{ color: 'white' }}>Status: {item.status}</Text>
                </View>

            </View>
        </Pressable>
    )
}