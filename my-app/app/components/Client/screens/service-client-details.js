import { Alert, Button, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import baseURL from '../../../../assets/common/baseUrl';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const ClientServiceDetail = ({ trainerIdProps = null }) => {

    const { id } = useLocalSearchParams();
    const [serviceDetails, setServiceDetails] = useState({})

    const getClientService = async () => {

        let trainerId = id;
        if (id) {
            trainerId = id;
        }

        if (trainerIdProps) {
            trainerId = trainerIdProps;
        }

        if (!trainerId) {
            return;
        }

        try {

            const { data } = await axios.get(`${baseURL}/availTrainer/${trainerId}`)

            setServiceDetails(data);
            // console.log(data)

        } catch (error) {
            console.error("Error fetching training sessions:", error);
        }
    }

    useEffect(() => {
        getClientService()
    }, [])

    return (
        <>
            {!trainerIdProps && (
                <View style={{ marginTop: 30, }} />
            )}
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ padding: 10, }}>

                    <View style={{ marginBottom: 10, }}>
                        <Text style={{ fontSize: 18, marginBottom: 5, textAlign: 'left', fontWeight: 900, }}>Coach Info</Text>
                        <View style={{ padding: 15, borderStyle: 'solid', borderWidth: 1, borderRadius: 10, }}>

                            <View style={{ flexDirection: 'row', gap: 10, }}>
                                {/* <Image
                                    height={130}
                                    width={120}
                                    borderRadius={5}
                                    source={{ uri: serviceDetails?.coachID?.image[0].url }}
                                /> */}
                                {serviceDetails?.coachID?.image[0]?.url ? (
                                    <Image height={130} width={120} borderRadius={5} source={{ uri: serviceDetails?.coachID?.image[0]?.url }} />
                                ) : (
                                    <>
                                        <Image height={130} width={120} borderRadius={5} source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541' }} />
                                    </>
                                )}
                                <View style={{ gap: 3, }}>
                                    <View>
                                        <Text style={{ fontSize: 15, fontWeight: 900, }}>Coach:</Text>
                                        <Text style={{ fontSize: 15, }}>{serviceDetails?.coachID?.name || 'Not specified'}</Text>
                                    </View>

                                    <View>
                                        <Text style={{ fontSize: 15, fontWeight: 900, }}>Email:</Text>
                                        <Text style={{ fontSize: 15, }}>{serviceDetails?.coachID?.email || 'Not specified'}</Text>
                                    </View>

                                    <View>
                                        <Text style={{ fontSize: 15, fontWeight: 900, }}>Contact No:</Text>
                                        <Text style={{ fontSize: 15, }}>{serviceDetails?.coachID?.phone || "Not specified"}</Text>
                                    </View>
                                </View>
                            </View>

                        </View>
                    </View>

                    <View style={{ marginBottom: 10, }}>
                        <Text style={{ fontSize: 18, marginBottom: 5, textAlign: 'left', fontWeight: 900, }}>Service Info</Text>
                        <View style={{ padding: 15, borderStyle: 'solid', borderWidth: 1, borderRadius: 10, }}>

                            <View style={{ gap: 5, }}>
                                <View style={{ flexDirection: 'row', }}>
                                    <Text style={{ textAlign: 'left', width: '50%', fontSize: 16, fontWeight: 900 }}>Package:</Text>
                                    <Text style={{ textAlign: 'center', width: '50%', fontSize: 16 }}>{serviceDetails?.package}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', }}>
                                    <Text style={{ textAlign: 'left', width: '50%', fontSize: 16, fontWeight: 900 }}>Session:</Text>
                                    <Text style={{ textAlign: 'center', width: '50%', fontSize: 16 }}>{serviceDetails?.sessions}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', }}>
                                    <Text style={{ textAlign: 'left', width: '50%', fontSize: 16, fontWeight: 900 }}>Session Rate:</Text>
                                    <Text style={{ textAlign: 'center', width: '50%', fontSize: 16 }}>P{serviceDetails?.sessionRate}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', }}>
                                    <Text style={{ textAlign: 'left', width: '50%', fontSize: 16, fontWeight: 900 }}>Start Date:</Text>
                                    <Text style={{ textAlign: 'center', width: '50%', fontSize: 16 }}>{serviceDetails?.startDate || "Not specified"}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', }}>
                                    <Text style={{ textAlign: 'left', width: '50%', fontSize: 16, fontWeight: 900 }}>End Date:</Text>
                                    <Text style={{ textAlign: 'center', width: '50%', fontSize: 16 }}>{new Date(serviceDetails?.endDate).toLocaleDateString()}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', }}>
                                    <Text style={{ textAlign: 'left', width: '50%', fontSize: 16, fontWeight: 900 }}>Total:</Text>
                                    <Text style={{ textAlign: 'center', width: '50%', fontSize: 16 }}>{serviceDetails?.total || "Not specified"}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', }}>
                                    <Text style={{ textAlign: 'left', width: '50%', fontSize: 16, fontWeight: 900 }}>Status:</Text>
                                    <Text style={{ textAlign: 'center', width: '50%', fontSize: 16 }}>{serviceDetails?.status}</Text>
                                </View>
                            </View>

                        </View>
                    </View>

                    <Schedules schedules={serviceDetails?.schedule} serviceDetails={serviceDetails} getClientService={getClientService} />

                </View>
            </ScrollView>
        </>
    )
}

const Schedules = ({ schedules, serviceDetails, getClientService }) => {

    return (
        <View style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 18, marginBottom: 5, textAlign: 'left', fontWeight: '900' }}>Schedule a Session</Text>
            {schedules?.map((schedule, index) => (
                <Session key={schedule._id} index={index} item={schedule} serviceDetails={serviceDetails} getClientService={getClientService} />
            ))}
        </View>
    )
}

const Session = ({ item, index, serviceDetails, getClientService }) => {

    const [date, setDate] = useState(null);
    const [time, setTime] = useState(null);
    const [status, setStatus] = useState('pending');

    useFocusEffect(
        useCallback(() => {
            setDate(item?.dateAssigned ? new Date(item?.dateAssigned) : null)
            setTime(item?.timeAssigned ? new Date(item?.timeAssigned) : null)
            setStatus(item?.status)
        }, [])
    )

    return (
        <View style={{ padding: 15, borderStyle: 'solid', borderWidth: 1, borderRadius: 10, marginBottom: 10, }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 16, fontWeight: 900, marginBottom: 10, }}>Session {index + 1}</Text>
                <Text style={{ fontSize: 16, fontWeight: 900, marginBottom: 10, }}>{status?.toUpperCase()}</Text>
            </View>
            <View style={{ marginBottom: 10 }}>
                <Text>Date</Text>
                <Pressable >
                    <View style={{ alignItems: 'center', borderRadius: 5, borderWidth: 1, padding: 10 }}>
                        <Text>{formatDate(date)}</Text>
                    </View>
                </Pressable>
            </View>
            <Pressable  >
                <Text>Time</Text>
                <View style={{ alignItems: 'center', borderRadius: 5, borderWidth: 1, padding: 10 }}>
                    <Text>{formatTime(time)}</Text>
                </View>
            </Pressable>
        </View>
    )
}

const formatTime = (date) => {
    if (!date) {
        return "Please wait your coach to assigned"
    }
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
};


function formatDate(dateString) {

    if (!dateString) {
        return "Please wait your coach to assigned"
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return "Not Specified";
    }

    const options = { month: "short", day: "numeric", year: "numeric" };
    return date.toLocaleDateString("en-US", options).replace(",", "");
}

export default ClientServiceDetail

const styles = StyleSheet.create({})