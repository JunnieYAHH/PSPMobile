import { Alert, Button, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import baseURL from '../../../../assets/common/baseUrl';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import LoadingScreen from '../../LodingScreen';
import { Picker } from '@react-native-picker/picker';

const ClientServiceDetail = () => {

    const { id } = useLocalSearchParams();
    const [serviceDetails, setServiceDetails] = useState({})
    const [screenLoading, setScreenLoading] = useState(false);
    const getClientService = async () => {
        setScreenLoading(true)
        try {

            const { data } = await axios.get(`${baseURL}/availTrainer/${id}`)
            setServiceDetails(data);
        } catch (error) {
            console.error("Error fetching training sessions:", error);
        }
        setScreenLoading(false)
    }

    useFocusEffect(
        useCallback(() => {
            getClientService()
        }, [])
    )

    return (
        <>
            <SafeAreaView>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ padding: 10, backgroundColor: '#3e3e42' }}>
                        <View style={{ marginBottom: 10, }}>
                            <Text style={{ fontSize: 18, marginBottom: 5, textAlign: 'left', fontWeight: 900, color: 'white' }}>Client Info</Text>
                            <View style={{ padding: 15, borderStyle: 'solid', borderWidth: 1, borderRadius: 10, borderColor: 'white' }}>
                                <View style={{ flexDirection: 'row', gap: 10, }}>
                                    <Image
                                        height={130}
                                        width={120}
                                        borderRadius={5}
                                        source={{ uri: serviceDetails?.userId?.image[0].url }}
                                    />
                                    <View style={{ gap: 3, }}>
                                        <View>
                                            <Text style={{ fontSize: 15, fontWeight: 900, color: 'white' }}>Name:</Text>
                                            <Text style={{ fontSize: 15, color: 'white' }}>{serviceDetails?.userId?.name}</Text>
                                        </View>
                                        <View>
                                            <Text style={{ fontSize: 15, fontWeight: 900, color: 'white' }}>Email:</Text>
                                            <Text style={{ fontSize: 15, color: 'white' }}>{serviceDetails?.userId?.email}</Text>
                                        </View>
                                        <View>
                                            <Text style={{ fontSize: 15, fontWeight: 900, color: 'white' }}>Contact No:</Text>
                                            <Text style={{ fontSize: 15, color: 'white' }}>{serviceDetails?.userId?.email}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={{ marginBottom: 10, }}>
                            <Text style={{ fontSize: 18, marginBottom: 5, textAlign: 'left', fontWeight: 900, color: 'white' }}>Service Info</Text>
                            <View style={{ padding: 15, borderStyle: 'solid', borderWidth: 1, borderRadius: 10, borderColor: 'white' }}>
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
                                    <View style={{ flexDirection: 'row', }}>
                                        <Text style={{ textAlign: 'left', width: '50%', fontSize: 16, fontWeight: 900, color: 'white' }}>Start Date:</Text>
                                        <Text style={{ textAlign: 'center', width: '50%', fontSize: 16, color: 'white' }}>{serviceDetails?.startDate || "Not specified"}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', }}>
                                        <Text style={{ textAlign: 'left', width: '50%', fontSize: 16, color: 'white', fontWeight: 900 }}>End Date:</Text>
                                        <Text style={{ textAlign: 'center', width: '50%', color: 'white', fontSize: 16 }}>{new Date(serviceDetails?.endDate).toLocaleDateString()}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', }}>
                                        <Text style={{ textAlign: 'left', width: '50%', fontSize: 16, color: 'white', fontWeight: 900 }}>Total:</Text>
                                        <Text style={{ textAlign: 'center', width: '50%', fontSize: 16, color: 'white', }}>{serviceDetails?.total || "Not specified"}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', }}>
                                        <Text style={{ textAlign: 'left', width: '50%', fontSize: 16, color: 'white', fontWeight: 900 }}>Status:</Text>
                                        <Text style={{ textAlign: 'center', width: '50%', fontSize: 16, color: 'white' }}>{serviceDetails?.status}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', }}>
                                        <Text style={{ textAlign: 'left', width: '50%', fontSize: 16, color: 'white', fontWeight: 900, color: 'white' }}>Type:</Text>
                                        <Text style={{ textAlign: 'center', width: '50%', fontSize: 16, color: 'white' }}>{serviceDetails?.trainingType}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <Schedules schedules={serviceDetails?.schedule} serviceDetails={serviceDetails} getClientService={getClientService} />

                    </View>
                </ScrollView>
            </SafeAreaView>
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

const trainings = ['Chest', 'Back', 'Arms', 'Legs', 'Core', 'Cardio'];

const Session = ({ item, index, serviceDetails, getClientService }) => {

    const [date, setDate] = useState(null);
    const [time, setTime] = useState(null);
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [status, setStatus] = useState('pending');
    const [selectedTrainings, setSelectedTrainings] = useState([]);

    const onChange = (event, selectedDate) => {
        setShow(false);

        if (event.type === "dismissed" && (!item.timeAssigned && !item.dateAssigned)) {
            setDate(null);
            setTime(null);
            return;
        }

        if (mode === 'date') {
            setDate(selectedDate);
        } else {
            setTime(selectedDate);
        }
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
    };

    useFocusEffect(
        useCallback(() => {
            setDate(item?.dateAssigned ? new Date(item?.dateAssigned) : null)
            setTime(item?.timeAssigned ? new Date(item?.timeAssigned) : null)
            setStatus(item?.status)
            setSelectedTrainings(item?.trainings)
        }, [])
    )

    const handleTrainingSelect = (training) => {
        setSelectedTrainings((prev) =>
            prev.includes(training)
                ? prev.filter((t) => t !== training)
                : [...prev, training]
        );
    };

    // console.log(selectedTrainings)
    const saveDateTimeSession = async () => {
        try {

            const { data } = await axios.put(
                `${baseURL}/availTrainer/update/session/${serviceDetails._id}?sessionId=${item._id}`,
                { sessionId: item._id, date, time, trainings: selectedTrainings }
            )

            getClientService()
            setStatus('waiting')

            Alert.alert("", data.message);
        } catch (err) {
            console.log("Error updating schedule: ");
            console.log(err);
        }
    }

    const cancelAssignedSession = async () => {

        if (!isSessionCancellable(item.dateAssigned)) {
            Alert.alert("", "You can only cancel a scheduled session if it is more than 24 hours away from the current time.");
            return;
        }

        try {

            const { data } = await axios.put(
                `${baseURL}/availTrainer/cancel/session/${serviceDetails._id}?sessionId=${item._id}`,)

            await getClientService()

            Alert.alert("", data.message);

            setDate(null)
            setTime(null)
            setStatus('pending')

        } catch (err) {
            console.log("Error updating schedule: ");
            console.log(err);
        }
    }

    const completeAssignedSession = async () => {

        if (!isPastDateTime(item.dateAssigned, item.timeAssigned)) {
            Alert.alert("", "You cannot mark the status as complete if the date and time have not yet passed.");
            return;
        }

        try {

            const { data } = await axios.put(
                `${baseURL}/availTrainer/complete/session/${serviceDetails._id}?sessionId=${item._id}`,)

            await getClientService()

            Alert.alert("", data.message);

            setStatus('completed')

        } catch (err) {
            console.log("Error updating schedule: ");
            console.log(err);
        }
    }

    function isSessionCancellable(itemDate) {
        const currentDate = new Date();

        const futureDate = new Date();
        futureDate.setDate(currentDate.getDate() + 2);

        const itemDateObj = new Date(itemDate);

        return itemDateObj >= futureDate;
    }

    function isPastDateTime(itemDate, itemTime) {
        const currentDateTime = new Date();

        if (!itemTime) {
            return false;
        }
        const itemDateTime = new Date(itemDate);

        return itemDateTime < currentDateTime;
    }

    return (
        <View style={{ padding: 15, borderStyle: 'solid', borderWidth: 1, borderRadius: 10, marginBottom: 10, borderColor: 'white' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                <Text style={{ fontSize: 16, fontWeight: 900, marginBottom: 10, color: 'white' }}>Session {index + 1}</Text>
                <Text style={{ fontSize: 16, fontWeight: 900, marginBottom: 10, color: 'white' }}>{status?.toUpperCase()}</Text>
            </View>
            <View style={{ marginBottom: 10 }}>
                <Pressable onPress={showDatepicker} >
                    <View style={{ alignItems: 'center', borderRadius: 5, borderWidth: 1, color: 'white', padding: 10, borderColor: 'white' }}>
                        <Text style={{ color: 'white' }}>{formatDate(date)}</Text>
                    </View>
                </Pressable>
            </View>
            <Pressable onPress={showTimepicker}>
                <View style={{ alignItems: 'center', borderRadius: 5, borderWidth: 1, padding: 10, borderColor: 'white' }}>
                    <Text style={{ color: 'white' }}>{formatTime(time)}</Text>
                </View>
            </Pressable>
            <View style={{ marginBottom: 10, alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <Text style={{ textAlign: 'center', marginBottom: 5, color: 'white' }}>Training Type</Text>
                <Picker
                    selectedValue={selectedTrainings.length > 0 ? selectedTrainings[selectedTrainings.length - 1] : ""}
                    onValueChange={(itemValue) => handleTrainingSelect(itemValue)}
                    style={{ width: '80%', borderRadius: 5, color: 'white' }}
                >
                    <Picker.Item label="Select Training" value="" color='black' />
                    {trainings.map((training) => (
                        <Picker.Item key={training} label={training} value={training} color='black' />
                    ))}
                </Picker>
                <Text style={{ textAlign: 'center', marginTop: 5, color: 'white' }}>
                    Selected: {selectedTrainings.length > 0 ? selectedTrainings.join(', ') : 'None'}
                </Text>
            </View>

            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={mode === 'date' ? date || new Date() : time || new Date()}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    minimumDate={new Date()}
                    onChange={onChange}
                />
            )}
            {(item.dateAssigned && item.timeAssigned && item.status !== 'completed') && (
                <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                    <View style={{ flex: 1 }}>
                        <Button
                            onPress={cancelAssignedSession}
                            title='Cancel'
                            color='black'
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Button
                            onPress={completeAssignedSession}
                            title='Done'
                            color='black'
                        />
                    </View>
                </View>
            )}

            {item.status === "completed" && (
                <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                    <View style={{ flex: 1 }}>
                        <Button
                            disabled={true}
                            title='NO ACTION'
                            color='black'
                        />
                    </View>
                </View>
            )}

            {(!item.dateAssigned || !item.timeAssigned) && (
                <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                    <View style={{ flex: 1 }}>
                        <Button
                            disabled={!date || !time}
                            onPress={saveDateTimeSession}
                            title='Confirm'
                            color='black'
                        />
                    </View>
                </View>
            )}
        </View>
    )
}

const formatTime = (date) => {
    if (!date) {
        return "Assign Time"
    }
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
};

function formatDate(dateString) {
    if (!dateString) {
        return "Assigned Date"
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