import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    StatusBar,
    ImageBackground,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Button,
    Modal,
    SafeAreaView as RNSafeAreaView,
    ScrollView
} from 'react-native';
import Constants from 'expo-constants';
import { useFocusEffect, useRouter } from 'expo-router';
import baseURL from '../../../../assets/common/baseUrl';
import axios from 'axios';
import { useSelector } from 'react-redux';
import ClientServiceDetail from '../screens/service-client-details';
import { SafeAreaView } from 'react-native-safe-area-context';
import ServicesAvailedLists from '../components/ServicesAvailedLists';
import { getTimedInLogs } from '../../../(services)/api/Users/getTimedInLogs';
import LoadingScreen from '../../LodingScreen';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import SubscriptionReminder from '../components/SubscriptionReminder';
import { Agenda } from 'react-native-calendars';
import Predictive from '../screens/predictive';

const daysInMonth = (year, month) => new Date(year, month, 0).getDate();
const Training = () => {
    const router = useRouter();
    const state = useSelector(state => state.auth);
    const user = useSelector((state) => state.auth.user);
    const [activeCount, setActiveCount] = useState(0);
    const [activeComponent, setActiveComponent] = useState(null);
    const [screenLoading, setScreenLoading] = useState(false);
    const [predictionLogs, setPredictiveLogs] = useState([]);
    const [hasActiveTraining, setHasActiveTraining] = useState(false);
    const [training, setTraining] = useState(null);
    const [view, setView] = useState('current');
    const [membershipExpiration, setMembershipExpiration] = useState({})
    const [showCalendar, setShowCalendar] = useState(false);

    const getUser = async () => {
        try {
            const data = await axios.get(`${baseURL}/users/get-user/${user?._id || user?.user?._id}`)
            setMembershipExpiration(data.data.user.subscriptionExpiration)
        } catch (error) {
            console.log('Frontend Index Error', error.message)
        }
    }
    useFocusEffect(
        useCallback(() => {
            if (user?._id || user?.user?._id) {
                getUser();
                const interval = setInterval(() => {
                    getUser();
                }, 3000);
                return () => clearInterval(interval);
            }
        }, [user?._id || user?.user?._id])
    );

    const getActiveLogs = async () => {
        try {
            const data = await getTimedInLogs();
            if (data && data.activeLogs) {
                const logsArray = Array.isArray(data.activeLogs) ? data.activeLogs : [data.activeLogs];
                const activeLogsCount = logsArray.filter(log => log.timeOut === null).length;
                setActiveCount(activeLogsCount);
            } else {
                setActiveCount(0);
            }
        } catch (error) {
            // console.error("Error fetching products:", error);
        }
    };

    const logsPrediction = async () => {
        try {
            const predictLogs = await axios.get(`${baseURL}/ml/logs-prediction`);
            setPredictiveLogs(predictLogs.data);
        } catch (error) {

        }
    };

    useFocusEffect(
        useCallback(() => {
            getActiveLogs();
            logsPrediction();
        }, [])
    );
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const totalDays = daysInMonth(year, month);
    const userId = user?.user?._id || user?._id

    const checkActiveTraining = async () => {
        setScreenLoading(true)
        setHasActiveTraining(false)
        setTraining(null)
        try {
            const { data } = await axios.get(`${baseURL}/availTrainer/has-active/${userId}`);
            setHasActiveTraining(data.hasActive);
            setTraining(data.training);
            console.log(data,'log')
        } catch (error) {
            console.log(error)
        }
        setScreenLoading(false)
    }
    const [myLogs, setMyLogs] = useState([])
    const [agendaItems, setAgendaItems] = useState({});

    const getMyLogs = async () => {
        setScreenLoading(true);
        try {
            const { data } = await axios.get(`${baseURL}/logs/get-my-logs/${userId}`);
            setMyLogs(data.logs);

            const items = {};
            data.logs.forEach(log => {
                const date = new Date(log.timeIn).toISOString().split('T')[0];
                if (!items[date]) items[date] = [];

                items[date].push({
                    name: "Gym Entry",
                    time: new Date(log.timeIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                });
            });

            setAgendaItems(items);
        } catch (error) {
            console.log(error);
        }
        setScreenLoading(false);
    };
    const gymDays = myLogs.map(log => new Date(log.timeIn).getDate());

    const renderDay = ({ item }) => {
        const isGymDay = gymDays.includes(item);
        return (
            <View
                style={[
                    styles.dayContainer,
                    isGymDay && styles.highlightedDay
                ]}
            >
                <Text style={styles.dayText}>{item}</Text>
            </View>
        );
    };
    useFocusEffect(
        useCallback(() => {
            checkActiveTraining();
            getMyLogs();
        }, [])
    )
    return (
        <>
            {screenLoading ? (
                <LoadingScreen />
            ) : (

                <>
                    <StatusBar translucent backgroundColor="transparent" />
                    <ImageBackground
                        source={require('../../../../assets/ProgramBG.png')}
                        style={styles.backgroundImage}
                        imageStyle={{ opacity: 2.0 }}
                        blurRadius={2}
                        resizeMode="cover"
                    >
                        {hasActiveTraining && training ? (
                            <View>
                                {hasActiveTraining && training && (
                                    <SafeAreaView>
                                        <TouchableOpacity onPress={() => setShowCalendar(true)} style={{ backgroundColor: '#FFBF00', padding: 10, borderRadius: 5, marginTop: 10 }}>
                                            <Text style={{ color: 'black', fontWeight: 'bold', textAlign: 'center' }}>My logs in {today.toLocaleString('default', { month: 'long' })} {year}</Text>
                                        </TouchableOpacity>
                                        <SubscriptionReminder expirationDate={membershipExpiration} userId={user?._id || user?.user?._id} />
                                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                            <View style={{ backgroundColor: '#CC5500', height: 130, width: 200, borderRadius: 7, marginTop: 10 }}>
                                                <View style={{ backgroundColor: 'black', height: 115, width: 180, alignSelf: 'center', marginTop: 7, borderRadius: 10 }}>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <View style={{ padding: 10 }}>
                                                            <View style={{ backgroundColor: '#FFAC1C', height: 60, width: 65, padding: 2, borderRadius: 40 }}>
                                                                <View style={{ backgroundColor: 'black', height: 50, width: 57, padding: 10, borderRadius: 70, marginTop: 3, marginLeft: 2 }}>
                                                                    <FontAwesome6 name="user-clock" size={30} color="white" />
                                                                </View>
                                                            </View>
                                                            <View style={{ marginTop: 5, marginLeft: 6 }}>
                                                                <Text style={{ color: '#FFBF00', fontSize: 24 }}>{activeCount} <Text style={{ color: 'white', fontSize: 24 }}>/ ???</Text></Text>
                                                            </View>
                                                        </View>
                                                        <View style={{ alignItems: 'center', marginTop: 25 }}>
                                                            <Text style={{ color: 'white', fontSize: 15, fontStyle: 'italic' }}>Current User/s</Text>
                                                            <Text style={{ color: '#FFBF00', fontSize: 16, fontWeight: 'bold', fontStyle: 'italic', marginTop: 5 }}>AT GYM</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={{ backgroundColor: '#CC5500', height: 130, width: 150, borderRadius: 7, marginTop: 10, marginLeft: 10 }}>
                                                <View style={{ backgroundColor: 'black', height: 120, width: 140, alignSelf: 'center', marginTop: 5, borderRadius: 20 }}>
                                                    <View style={{ padding: 15 }}>
                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                                                            <TouchableOpacity onPress={() => router.push('/components/Client/screens/history')}>
                                                                <MaterialIcons name="create-new-folder" size={24} color="white" />
                                                                <Text style={{ color: 'white', fontSize: 8, marginLeft: 2 }}>History</Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={() => router.push('/components/Client/screens/progress')}>
                                                                <MaterialCommunityIcons name="sale" size={24} color="white" style={{ marginLeft: 2 }} />
                                                                <Text style={{ color: 'white', fontSize: 8 }}>Progress</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>

                                        <View style={{ flexDirection: 'row', gap: 5, padding: 10, }}>
                                            <View style={{ flex: 1, }}>
                                                <Button onPress={() => setView('current')} title='Gym Service'
                                                    color={view === 'current' ? '#FFAC1C' : '#AAAAAA'}
                                                />
                                            </View>
                                            <View style={{ flex: 1, }}>
                                                <Button onPress={() => setView('all')} title='Client Service'
                                                    color={view === 'all' ? '#FFAC1C' : '#AAAAAA'}
                                                />
                                            </View>
                                        </View>

                                        {view === 'current' && (
                                            <View style={{ padding: 10, }}>
                                                <Text style={{ fontWeight: '900', fontSize: 16, marginBottom: 10, color: 'white' }}>Client Availed Services</Text>
                                                <ServicesAvailedLists key={hasActiveTraining + "current"} />
                                                <Predictive />
                                            </View>
                                        )}
                                        <Modal
                                            visible={showCalendar}
                                            transparent={false}
                                            animationType="slide"
                                            onRequestClose={() => setShowCalendar(false)}
                                        >
                                            <View style={{ flex: 1, backgroundColor: 'black' }}>
                                                <TouchableOpacity
                                                    onPress={() => setShowCalendar(false)}
                                                    style={{ padding: 15, alignSelf: 'flex-end' }}
                                                >
                                                    <Text style={{ color: 'white' }}>Close</Text>
                                                </TouchableOpacity>
                                                <Agenda
                                                    items={agendaItems}
                                                    selected={Object.keys(agendaItems)[0] || new Date().toISOString().split('T')[0]}
                                                    renderItem={(item, firstItemInDay) => (
                                                        <View style={{ backgroundColor: '#333', padding: 10, marginVertical: 5, borderRadius: 5 }}>
                                                            <Text style={{ color: 'white', fontWeight: 'bold' }}>{item.name}</Text>
                                                            <Text style={{ color: 'white' }}>Time: {item.time}</Text>
                                                        </View>
                                                    )}
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
                                            </View>
                                        </Modal>
                                    </SafeAreaView >
                                )}
                                {view === 'all' && (
                                    <ClientServiceDetail key={hasActiveTraining + "all"} trainerIdProps={training._id} />
                                )}
                            </View>
                        ) : (
                            <RNSafeAreaView style={styles.container}>
                                <SubscriptionReminder expirationDate={membershipExpiration} userId={user?._id || user?.user?._id} />
                                <ImageBackground
                                    source={require('../../../../assets/ProgramBG.png')}
                                    style={styles.backgroundImage}
                                    imageStyle={{ opacity: 0.7 }}
                                    blurRadius={2}
                                    resizeMode="cover"
                                >
                                    <View
                                        style={styles.overlay}
                                    >
                                        <Text style={styles.header}>
                                            Training - {today.toLocaleString('default', { month: 'long' })} {year}
                                        </Text>
                                        <View style={{ flexDirection: 'row' }}>
                                            <View style={{ backgroundColor: '#CC5500', height: 130, width: 200, borderRadius: 7, marginTop: 10 }}>
                                                <View style={{ backgroundColor: 'black', height: 115, width: 180, alignSelf: 'center', marginTop: 7, borderRadius: 10 }}>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <View style={{ padding: 10 }}>
                                                            <View style={{ backgroundColor: '#FFAC1C', height: 60, width: 65, padding: 2, borderRadius: 40 }}>
                                                                <View style={{ backgroundColor: 'black', height: 50, width: 57, padding: 10, borderRadius: 70, marginTop: 3, marginLeft: 2 }}>
                                                                    <FontAwesome6 name="user-clock" size={30} color="white" />
                                                                </View>
                                                            </View>
                                                            <View style={{ marginTop: 5, marginLeft: 6 }}>
                                                                <Text style={{ color: '#FFBF00', fontSize: 24 }}>{activeCount} <Text style={{ color: 'white', fontSize: 24 }}>/ ???</Text></Text>
                                                            </View>
                                                        </View>
                                                        <View style={{ alignItems: 'center', marginTop: 25 }}>
                                                            <Text style={{ color: 'white', fontSize: 15, fontStyle: 'italic' }}>Current User/s</Text>
                                                            <Text style={{ color: '#FFBF00', fontSize: 16, fontWeight: 'bold', fontStyle: 'italic', marginTop: 5 }}>AT GYM</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={{ backgroundColor: '#CC5500', height: 130, width: 150, borderRadius: 7, marginTop: 10, marginLeft: 10 }}>
                                                <View style={{ backgroundColor: 'black', height: 120, width: 140, alignSelf: 'center', marginTop: 5, borderRadius: 20 }}>
                                                    <View style={{ padding: 15 }}>
                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                                                            <TouchableOpacity onPress={() => router.push('/components/Client/screens/history')}>
                                                                <MaterialIcons name="create-new-folder" size={24} color="white" />
                                                                <Text style={{ color: 'white', fontSize: 8, marginLeft: 2 }}>History</Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={() => setActiveComponent('Progress')}>
                                                                <MaterialCommunityIcons name="sale" size={24} color="white" style={{ marginLeft: 2 }} />
                                                                <Text style={{ color: 'white', fontSize: 8 }}>Progress</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>

                                        <TouchableOpacity
                                            style={styles.button}
                                            onPress={() => router.push("/components/Client/components/AvailTrainer")}
                                        >
                                            <Text style={styles.buttonText}>Avail Trainer?</Text>
                                        </TouchableOpacity>

                                        <Text style={styles.header}>
                                            Gym Calendar - {today.toLocaleString('default', { month: 'long' })} {year}
                                        </Text>

                                        {/* Calendar Section */}
                                        <FlatList
                                            data={Array.from({ length: totalDays }, (_, i) => i + 1)}
                                            keyExtractor={(item) => item.toString()}
                                            numColumns={7}
                                            renderItem={renderDay}
                                            contentContainerStyle={styles.calendarContainer}
                                        />
                                    </View>
                                </ImageBackground>
                            </RNSafeAreaView>
                        )}
                    </ImageBackground>
                </>
            )}
        </>
    );
};

export default Training;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#f4f4f4',
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    overlay: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
    },
    weightSection: {
        width: '90%',
        padding: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 8,
        marginBottom: 10,
        elevation: 3,
    },
    weightHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    weightText: {
        fontSize: 16,
        color: '#555',
        marginBottom: 5,
    },
    healthSection: {
        width: '90%',
        padding: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 8,
        marginBottom: 20,
        elevation: 3,
    },
    healthHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    healthText: {
        fontSize: 16,
        color: '#555',
        marginBottom: 5,
    },
    calendarContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        backgroundColor: '#FFAC1C',
        borderRadius: 20,
        padding: 5,
    },
    dayContainer: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
        borderRadius: 5,
        backgroundColor: 'white',
        shadowOpacity: 10,
    },
    highlightedDay: {
        backgroundColor: '#FFD700',
    },
    dayText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    highlightedText: {
        color: 'white',
        fontWeight: 'bold',
    },
    button: {
        height: 50,
        width: '50%',
        backgroundColor: '#FFAC1C',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 20,
        marginBottom:20
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
});