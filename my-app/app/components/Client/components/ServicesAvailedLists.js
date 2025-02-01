import React, { useCallback, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import Icon from "react-native-vector-icons/FontAwesome";
import { logoutAction } from '../../../(redux)/authSlice';
import styles from '../../styles/Client/ClientHomeStyles';
import { View, Text, StatusBar, TouchableOpacity, FlatList, Pressable, Image, StyleSheet } from 'react-native';
import LoadingScreen from '../../LodingScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import baseURL from '../../../../assets/common/baseUrl';

export default function ServicesAvailedLists() {

    const state = useSelector(state => state.auth);
    const [screenLoading, setScreenLoading] = useState(false);

    const [services, setServices] = useState([]);

    const getAvailedServices = async () => {
        setScreenLoading(true)
        const { user } = state;
        console.log(user)
        try {

            const { data } = await axios.get(`${baseURL}/availTrainer/client/${user._id}`);

            setServices(data);

        } catch (err) {
            console.log(err);
        }
        setScreenLoading(false)
    }

    useFocusEffect(
        useCallback(() => {
            getAvailedServices()
        }, [])
    )

    return (
        <>
            {screenLoading ?
                <View>
                    <Text>Loading...</Text>
                </View>
                :
                <View>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={services}
                        key={item => item._id}
                        renderItem={({ item }) => <ServiceDetail item={item} />}
                    />
                </View >
            }
        </>
    )

}

const ServiceDetail = ({ item }) => {

    const router = useRouter();
    const [completedSession, setCompletedSession] = useState(0);

    const goToDetail = () => {
        router.push({
            pathname: '/components/Client/screens/service-client-details',
            params: { id: item._id }
        });
    }

    useFocusEffect(
        useCallback(() => {

            const countCompleted = item.schedule.reduce((count, item) => {
                return item.status === "completed" ? count + 1 : count;
            }, 0);
            setCompletedSession(countCompleted);

        }, [])
    )

    return (
        <Pressable onPress={goToDetail}>
            <View style={{ padding: 10, borderRadius: 10, borderWidth: 1, marginBottom: 10, }} >
                <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10, }}>
                    {item?.coachID?.image[0]?.url ? (
                        <Image height={65} width={65} borderRadius={5} source={{ uri: item?.coachID?.image[0]?.url }} />
                    ) : (
                        <>
                            <Image height={65} width={65} borderRadius={5} source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541' }} />
                        </>
                    )}
                    <View style={{ alignSelf: 'center' }}>
                        <Text>Coach: {item?.coachID?.name || "Not specified"}</Text>
                        <Text>Email: {item?.coachID?.email || "Not specified"}</Text>
                        <Text>Phone: {item?.coachID?.phone || "Not specified"}</Text>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <Text>
                        {item.package}
                    </Text>

                    <Text>
                        |
                    </Text>

                    <Text>
                        {completedSession}/{item.sessions} Sessions
                    </Text>

                    <Text>
                        |
                    </Text>

                    <Text>
                        P{item.sessionRate} Rate
                    </Text>
                </View>

                <View style={{ marginTop: 5, flexDirection: 'row', gap: 10 }}>
                    <Text>Status: {item.status}</Text>

                    <Text>
                        |
                    </Text>

                    <Text>
                        Next Schedule: {item?.schedule && formatDate(getNextScheduleAfterLatestCompleted(item)?.dateAssigned)}
                    </Text>

                </View>

            </View>
        </Pressable>
    )
}

function getNextScheduleAfterLatestCompleted(item) {
    console.log(item)
    // Sort schedules by date ascending (assuming each item has a date)
    const sortedSchedules = item?.schedule?.sort((a, b) => new Date(a?.dateAssigned) - new Date(b?.dateAssigned));

    // Find the index of the last completed schedule
    const lastCompletedIndex = sortedSchedules?.findLastIndex(s => s.status === "completed");

    // Return the next schedule after the latest completed one, if it exists
    return lastCompletedIndex !== -1 && lastCompletedIndex < sortedSchedules?.length - 1
        ? sortedSchedules[lastCompletedIndex + 1]
        : null;  // Return null if no next schedule exists
}

function formatDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return "Not Specified";
    }

    const options = { month: "short", day: "numeric", year: "numeric" };
    return date.toLocaleDateString("en-US", options).replace(",", "");
}
