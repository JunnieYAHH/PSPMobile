import { Alert, Button, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import baseURL from '../../../../assets/common/baseUrl';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSelector } from 'react-redux';

const ClientServiceDetail = ({ trainerIdProps = null }) => {

    const { id } = useLocalSearchParams();
    const [serviceDetails, setServiceDetails] = useState({})
    const { user } = useSelector((state) => state.auth);
    const coachId = serviceDetails.coachID?._id || []
    const userId = user.user?._id || []
    // console.log(coachId, 'Coach')
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

    useFocusEffect(
        useCallback(() => {
            getClientService()
        }, [])
    );

    const [selectedRating, setSelectedRating] = useState(null);

    const emojiSentimentMap = {
        "😊": 5,
        "😀": 4,
        "😐": 3,
        "😞": 2,
        "😡": 1
    };

    const handleRating = async (rating) => {
        setSelectedRating(rating);
        // console.log(rating)
        try {
            const data = await axios.post(`${baseURL}/users/rating`, { rating, userId, coachId });
            Alert.alert(
                "Submission Of Rating Successful",
                "Thank you for your feedback.",
                [
                    {
                        text: "OK",
                    },
                ]
            );
            setSelectedRating()
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <>
            {!trainerIdProps && (
                <View style={{ marginTop: 30, }} />
            )}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
                <View style={{ paddingBottom: 200 }}>
                    <View style={{ marginBottom: 10, }}>
                        <Text style={{ fontSize: 18, marginBottom: 5, textAlign: 'left', fontWeight: 900, color: 'white' }}>Coach Info</Text>
                        <View style={{ padding: 15, borderStyle: 'solid', borderWidth: 1, borderRadius: 10, }}>

                            <View style={{ flexDirection: 'row', gap: 10, }}>
                                {serviceDetails?.coachID?.image[0]?.url ? (
                                    <Image height={130} width={120} borderRadius={5} source={{ uri: serviceDetails?.coachID?.image[0]?.url }} />
                                ) : (
                                    <>
                                        <Image height={130} width={120} borderRadius={5} source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541' }} />
                                    </>
                                )}
                                <View style={{ gap: 3, }}>
                                    <View>
                                        <Text style={{ fontSize: 15, fontWeight: 900, color: 'white' }}>Coach:</Text>
                                        <Text style={{ fontSize: 15, color: 'white' }}>{serviceDetails?.coachID?.name || 'Not specified'}</Text>
                                    </View>

                                    <View>
                                        <Text style={{ fontSize: 15, fontWeight: 900, color: 'white' }}>Email:</Text>
                                        <Text style={{ fontSize: 15, color: 'white' }}>{serviceDetails?.coachID?.email || 'Not specified'}</Text>
                                    </View>

                                    <View>
                                        <Text style={{ fontSize: 15, fontWeight: 900, color: 'white' }}>Contact No:</Text>
                                        <Text style={{ fontSize: 15, color: 'white' }}>{serviceDetails?.coachID?.phone || "Not specified"}</Text>
                                    </View>
                                </View>
                            </View>
                            <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'center', color: 'white', marginTop: 15 }}>Pick to Rate:</Text>
                            <View style={{ flexDirection: 'row', gap: 30, alignSelf: 'center', marginTop: 15 }}>
                                {Object.entries(emojiSentimentMap).map(([emoji, rating]) => (
                                    <TouchableOpacity key={rating} onPress={() => handleRating(rating)}>
                                        <Text style={{ fontSize: 30 }}>
                                            {emoji}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>
                    <View style={{ marginBottom: 10, }}>
                        <Text style={{ fontSize: 18, marginBottom: 5, textAlign: 'left', fontWeight: 900, color: 'white' }}>Service Info</Text>
                        <View style={{ padding: 15, borderStyle: 'solid', borderWidth: 1, borderRadius: 10, }}>

                            <View style={{ gap: 5, }}>
                                <View style={{ flexDirection: 'row', }}>
                                    <Text style={{ textAlign: 'left', width: '50%', fontSize: 16, fontWeight: 900, color: 'white' }}>Package:</Text>
                                    <Text style={{ textAlign: 'center', width: '50%', fontSize: 16, color: 'white' }}>{serviceDetails?.package}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', }}>
                                    <Text style={{ textAlign: 'left', width: '50%', fontSize: 16, fontWeight: 900, color: 'white' }}>Session:</Text>
                                    <Text style={{ textAlign: 'center', width: '50%', fontSize: 16, color: 'white' }}>{serviceDetails?.sessions}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', }}>
                                    <Text style={{ textAlign: 'left', width: '50%', fontSize: 16, fontWeight: 900, color: 'white' }}>Session Rate:</Text>
                                    <Text style={{ textAlign: 'center', width: '50%', fontSize: 16, color: 'white' }}>P{serviceDetails?.sessionRate}</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ textAlign: 'left', width: '50%', fontSize: 16, fontWeight: 900, color: 'white' }}>Start Date:</Text>
                                    <Text style={{ textAlign: 'center', width: '50%', fontSize: 16, color: 'white' }}>
                                        {
                                            serviceDetails?.schedule?.length > 0 && serviceDetails?.schedule[0]?.timeAssigned
                                                ? new Date(serviceDetails.schedule[0].timeAssigned).toLocaleDateString()
                                                : 'Not Assigned'
                                        }
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', }}>
                                    <Text style={{ textAlign: 'left', width: '50%', fontSize: 16, fontWeight: 900, color: 'white' }}>Total:</Text>
                                    <Text style={{ textAlign: 'center', width: '50%', fontSize: 16, color: 'white' }}>{serviceDetails?.total || "Not specified"}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', }}>
                                    <Text style={{ textAlign: 'left', width: '50%', fontSize: 16, fontWeight: 900, color: 'white' }}>Status:</Text>
                                    <Text style={{ textAlign: 'center', width: '50%', fontSize: 16, color: 'white' }}>{serviceDetails?.status}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', }}>
                                    <Text style={{ textAlign: 'left', width: '50%', fontSize: 16, fontWeight: 900, color: 'white' }}>Type:</Text>
                                    <Text style={{ textAlign: 'center', width: '50%', fontSize: 16, color: 'white' }}>{serviceDetails?.trainingType}</Text>
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
            <Text style={{ fontSize: 18, marginBottom: 5, textAlign: 'left', fontWeight: '900', color: 'white' }}>Schedule a Session</Text>
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
    const [trainings, setTrainings] = useState([]);

    useFocusEffect(
        useCallback(() => {
            setDate(item?.dateAssigned ? new Date(item?.dateAssigned) : null)
            setTime(item?.timeAssigned ? new Date(item?.timeAssigned) : null)
            setStatus(item?.status)
            setTrainings(item?.trainings || [])
        }, [])
    )

    return (
        <View style={{ padding: 15, borderStyle: 'solid', borderWidth: 1, borderRadius: 10, marginBottom: 10, }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 16, fontWeight: 900, marginBottom: 10, color: 'white' }}>Session {index + 1}</Text>
                <Text style={{ fontSize: 16, fontWeight: 900, marginBottom: 10, color: 'white' }}>{status?.toUpperCase()}</Text>
            </View>
            <View style={{ marginBottom: 10 }}>
                <Text style={{ color: 'white' }}>Date</Text>
                <Pressable >
                    <View style={{ alignItems: 'center', borderRadius: 5, borderWidth: 1, padding: 10 }}>
                        <Text style={{ color: 'white' }}>{formatDate(date)}</Text>
                    </View>
                </Pressable>
            </View>
            <Pressable  >
                <Text style={{ color: 'white' }}>Time</Text>
                <View style={{ alignItems: 'center', borderRadius: 5, borderWidth: 1, padding: 10 }}>
                    <Text style={{ color: 'white' }}>{formatTime(time)}</Text>
                </View>
            </Pressable>
            {/* Display Trainings */}
            <View style={{ marginTop: 10 }}>
                <Text style={{ color: 'white' }}>Trainings</Text>
                {trainings.length > 0 ? (
                    <View style={{ marginTop: 5 }}>
                        {trainings.map((training, idx) => (
                            <Text key={idx} style={{ color: 'white', fontSize: 14 }}>
                                • {training}
                            </Text>
                        ))}
                    </View>
                ) : (
                    <Text style={{ color: 'gray', fontSize: 14 }}>No trainings assigned</Text>
                )}
            </View>
        </View>
    )
}

const formatTime = (date) => {
    if (!date) {
        return "Please wait your coach to assign."
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