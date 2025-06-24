import { StyleSheet, Text, View, ScrollView, StatusBar, ImageBackground, Image, Button, Modal, FlatList, Pressable, Alert } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import Constants from 'expo-constants';
import axios from 'axios';
import baseURL from '../../../../assets/common/baseUrl';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useSelector } from 'react-redux';

const TrainingSession = () => {

    const [trainingSession, setTraningSession] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCoachId, setSelectedCoachId] = useState(null);
    const [coaches, setCoaches] = useState([]);
    const { id } = useLocalSearchParams();
    const user = useSelector((state) => state.auth.user);
    const userId = user?.user?._id || user?._id
    const clientId = trainingSession?.userId._id
    const userBranch = user?.user?.userBranch || user?.userBranch
    console.log(trainingSession?.userId._id, 'Training Session')
    const getTrainingSession = async () => {
        try {

            const { data } = await axios.get(`${baseURL}/availTrainer/${id}`)

            setTraningSession(data);
            setSelectedCoachId(data?.coachID?._id || null);

        } catch (error) {
            console.error("Error fetching training sessions:", error);
        }
    }

    const setCoach = async () => {
        try {
            const { data } = await axios.put(`${baseURL}/availTrainer/${id}`, { coachID: selectedCoachId, clientId })
            // getCoaches();
            getTrainingSession()
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error fetching training sessions:", error);
        }
    }

    const fetchCoachClients = async () => {
        try {
            const { data } = await axios.post(`${baseURL}/users/coach-clients`, { userBranch });
            console.log("Coach Clients:", data.coachesWithClients);
            setCoaches(data.coachesWithClients);
        } catch (err) {
            console.error("Error fetching coach clients:", err);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchCoachClients();
            getTrainingSession()
        }, [])
    )

    if (!trainingSession || !trainingSession.userId || !trainingSession.userId.image?.[0]?.url) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
                <Text style={{ color: 'white' }}>Loading training session...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" />
            <ImageBackground
                source={require('../../../../assets/ProgramBG.png')}
                style={styles.backgroundImage}
                imageStyle={{ opacity: 2.0 }}
                blurRadius={2}
                resizeMode="cover"
            >
                <View style={styles.overlay}>
                    <View style={{ paddingHorizontal: 5, gap: 10, }}>

                        <View>
                            <Text style={{ color: '#FFAC1C', fontSize: 18, marginBottom: 5, textAlign: 'left', fontWeight: 900, }}>Client Info</Text>
                            <View style={{ padding: 15, borderStyle: 'solid', borderWidth: 1, borderColor: '#FFAC1C', borderRadius: 10, }}>

                                <View style={{ flexDirection: 'row', gap: 10, }}>
                                    <Image
                                        height={130}
                                        width={120}
                                        source={{ uri: trainingSession?.userId?.image[0].url }}
                                    />
                                    <View style={{ gap: 3, }}>
                                        <View>
                                            <Text style={{ color: 'white', fontSize: 15, fontWeight: 900, }}>Name:</Text>
                                            <Text style={{ color: 'white', fontSize: 15, }}>{trainingSession?.userId.name}</Text>
                                        </View>

                                        <View>
                                            <Text style={{ color: 'white', fontSize: 15, fontWeight: 900, }}>Email:</Text>
                                            <Text style={{ color: 'white', fontSize: 15, }}>{trainingSession?.userId.email}</Text>
                                        </View>

                                        <View>
                                            <Text style={{ color: 'white', fontSize: 15, fontWeight: 900, }}>Contact No:</Text>
                                            <Text style={{ color: 'white', fontSize: 15, }}>{trainingSession?.userId.email}</Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => {
                                            router.push({
                                                pathname: '/components/Client/Chat/ChatRoom',
                                                params: {
                                                    userId: userId,
                                                    receiverId: trainingSession?.userId._id,
                                                },
                                            });
                                        }}
                                        style={{ padding: 8 }}
                                    >
                                        <FontAwesome name="comments" size={24} color="white" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <View>
                            <Text style={{ color: '#FFAC1C', fontSize: 18, marginBottom: 5, textAlign: 'left', fontWeight: 900, }}>Service Info</Text>
                            <View style={{ padding: 15, borderStyle: 'solid', borderWidth: 1, borderColor: '#FFAC1C', borderRadius: 10, }}>

                                <View style={{ gap: 5, }}>
                                    <View style={{ flexDirection: 'row', }}>
                                        <Text style={{ color: 'white', textAlign: 'left', width: '50%', fontSize: 16, fontWeight: 900 }}>Package:</Text>
                                        <Text style={{ color: 'white', textAlign: 'center', width: '50%', fontSize: 16 }}>{trainingSession?.package}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', }}>
                                        <Text style={{ color: 'white', textAlign: 'left', width: '50%', fontSize: 16, fontWeight: 900 }}>Session:</Text>
                                        <Text style={{ color: 'white', textAlign: 'center', width: '50%', fontSize: 16 }}>{trainingSession?.sessions}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', }}>
                                        <Text style={{ color: 'white', textAlign: 'left', width: '50%', fontSize: 16, fontWeight: 900 }}>Session Rate:</Text>
                                        <Text style={{ color: 'white', textAlign: 'center', width: '50%', fontSize: 16 }}>P{trainingSession?.sessionRate}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', }}>
                                        <Text style={{ color: 'white', textAlign: 'left', width: '50%', fontSize: 16, fontWeight: 900 }}>Start Date:</Text>
                                        <Text style={{ color: 'white', textAlign: 'center', width: '50%', fontSize: 16 }}>{new Date(trainingSession?.schedule[0].timeAssigned || "Not specified").toLocaleDateString()}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', }}>
                                        <Text style={{ color: 'white', textAlign: 'left', width: '50%', fontSize: 16, fontWeight: 900 }}>End Date:</Text>
                                        <Text style={{ color: 'white', textAlign: 'center', width: '50%', fontSize: 16 }}>{new Date(trainingSession?.endDate).toLocaleDateString()}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', }}>
                                        <Text style={{ color: 'white', textAlign: 'left', width: '50%', fontSize: 16, fontWeight: 900 }}>Total:</Text>
                                        <Text style={{ color: 'white', textAlign: 'center', width: '50%', fontSize: 16 }}>{trainingSession?.total || "Not specified"}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', }}>
                                        <Text style={{ color: 'white', textAlign: 'left', width: '50%', fontSize: 16, fontWeight: 900 }}>Status:</Text>
                                        <Text style={{ color: 'white', textAlign: 'center', width: '50%', fontSize: 16 }}>{trainingSession?.status}</Text>
                                    </View>
                                </View>

                            </View>
                        </View>

                        <View>
                            <Text style={{ color: '#FFAC1C', fontSize: 18, marginBottom: 5, textAlign: 'left', fontWeight: 900, }}>Coach Info</Text>
                            <View style={{ padding: 15, borderStyle: 'solid', borderWidth: 1, borderColor: '#FFAC1C', borderRadius: 10, }}>

                                {trainingSession?.coachID && (
                                    <View style={{ gap: 10, }}>
                                        <View style={{ flexDirection: 'row', gap: 10, }}>
                                            <Image
                                                height={130}
                                                width={120}
                                                source={{ uri: trainingSession?.coachID?.image[0].url }}
                                            />
                                            <View style={{ gap: 3, }}>
                                                <View>
                                                    <Text style={{ color: 'white', fontSize: 15, fontWeight: 900, }}>Name:</Text>
                                                    <Text style={{ color: 'white', fontSize: 15, }}>{trainingSession?.coachID.name}</Text>
                                                </View>

                                                <View>
                                                    <Text style={{ color: 'white', fontSize: 15, fontWeight: 900, }}>Email:</Text>
                                                    <Text style={{ color: 'white', fontSize: 15, }}>{trainingSession?.coachID.email}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        {trainingSession.status === 'inactive' && (
                                            <Button
                                                onPress={() => setIsModalOpen(true)}
                                                color={"#FFAC1C"}
                                                title='Change Coach'
                                            />
                                        )}
                                    </View>
                                )}
                                {!trainingSession?.coachID && (
                                    <Button
                                        onPress={() => setIsModalOpen(true)}
                                        color={"#FFAC1C"}
                                        title='Assign Coach'
                                    />
                                )}
                            </View>
                        </View>

                    </View>

                </View>

                <Modal
                    animationType='fade'
                    visible={isModalOpen}
                // transparent={true}
                >
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#444444'
                    }}>
                        <View style={{
                            height: '90%',
                            width: '90%',
                            borderColor: '#FFAC1C',
                            borderWidth: 1,
                            backgroundColor: '#232323',
                            borderRadius: 10,
                            // padding: 20,
                            shadowColor: '#FFAC1C',
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 4,
                            elevation: 5,
                        }}>
                            <View style={{ borderColor: '#FFAC1C', borderBottomWidth: 1, height: 40, justifyContent: 'center' }}>
                                <Text style={{ textAlign: 'center', color: '#FFAC1C', fontWeight: 900, fontSize: 15 }}>Select Coach</Text>
                            </View>

                            <View>
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    keyExtractor={(item) => item.coachId}
                                    data={coaches}
                                    renderItem={({ item }) => (
                                        <Pressable
                                            style={({ pressed }) => ({
                                                padding: 10,
                                                borderTopWidth: 1,
                                                borderColor: '#FFAC1C',
                                                backgroundColor: selectedCoachId === item.coachId ? '#505050' : null,
                                                opacity: pressed ? 0.7 : 1,
                                            })}
                                            onPress={() => setSelectedCoachId(item.coachId)}
                                        >
                                            <View style={{ flexDirection: 'row', gap: 10 }}>
                                                <Image
                                                    source={{ uri: item?.image?.[0]?.url }}
                                                    style={{
                                                        width: 75,
                                                        height: 75,
                                                        borderRadius: 37.5,
                                                        overflow: 'hidden',
                                                    }}
                                                />
                                                <View style={{ alignSelf: 'center', marginTop: -10 }}>
                                                    <Text style={{ color: 'white', fontSize: 16 }}>{item?.coachName}</Text>
                                                    <Text style={{ color: 'white', fontSize: 12 }}>{item?.coachEmail}</Text>
                                                </View>
                                            </View>

                                            {/* 👇 Display clients here */}
                                            <View style={{ marginTop: 10, paddingLeft: 10 }}>
                                                <Text style={{ color: 'white', fontSize: 12, marginBottom: 8 }}>Clients At The Moment:</Text>
                                                {Array.isArray(item.clients)
                                                    ? item.clients.map((client) => (
                                                        <View key={client.clientId} style={{ marginBottom: 5 }}>
                                                            <Text style={{ color: '#ccc', fontSize: 13 }}>
                                                                • {client.name} ({client.email})
                                                            </Text>
                                                        </View>
                                                    ))
                                                    : (
                                                        <Text style={{ color: '#999', fontSize: 13 }}>
                                                            {item.clients}
                                                        </Text>
                                                    )}
                                            </View>
                                        </Pressable>
                                    )}
                                />
                            </View>

                            <View style={{ marginTop: 'auto', flexDirection: 'row', padding: 10, borderTopWidth: 1, borderTopColor: '#FFAC1C', justifyContent: 'space-between' }}>
                                <Button
                                    onPress={() => {
                                        setSelectedCoachId(trainingSession?.coachID?._id || null)
                                        setIsModalOpen(false)
                                    }}
                                    color={'red'}
                                    title='Cancel'
                                />
                                <Button
                                    onPress={() => {
                                        if (!selectedCoachId) {
                                            Alert.alert('', 'Please select coach first')
                                            return;
                                        }
                                        setCoach();
                                    }}
                                    color={'#FFAC1C'}
                                    title='Assign'
                                />
                            </View>
                        </View>
                    </View>
                </Modal>

            </ImageBackground>
        </View>
    )
}

export default TrainingSession

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    overlay: {
        flex: 1,
        marginTop: 10,
        // padding: 15,
    },
    dashboardContainer: {
        flexDirection: 'column',
    },
    pspText: {
        fontSize: 50,
        color: '#FFAC1C',
        fontStyle: 'italic',
        transform: [{ skewX: '-10deg' }],
    },
    dashboardText: {
        fontSize: 40,
        color: 'white',
        fontStyle: 'italic',
        transform: [{ skewX: '-10deg' }],
    },
});