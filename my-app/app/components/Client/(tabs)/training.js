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
    SafeAreaView as RNSafeAreaView
} from 'react-native';
import Constants from 'expo-constants';
import { useFocusEffect, useRouter } from 'expo-router';
import baseURL from '../../../../assets/common/baseUrl';
import axios from 'axios';
import { useSelector } from 'react-redux';
import ClientServiceDetail from '../screens/service-client-details';
import { SafeAreaView } from 'react-native-safe-area-context';
import ServicesAvailedLists from '../components/ServicesAvailedLists';
import LoadingScreen from '../../LodingScreen';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const daysInMonth = (year, month) => new Date(year, month, 0).getDate();

const Training = () => {

    const router = useRouter();
    const state = useSelector(state => state.auth);
    const [gymDays, setGymDays] = useState([2, 5, 9, 12, 16, 20, 23, 27]);
    const [weightData] = useState({
        initialWeight: 62, // in kilos
        currentWeight: 65, // in kilos
    });
    const [activeCount, setActiveCount] = useState(0);
    const [activeComponent, setActiveComponent] = useState(null);
    const [screenLoading, setScreenLoading] = useState(false);

    const [hasActiveTraining, setHasActiveTraining] = useState(false);
    const [training, setTraining] = useState(null);
    const [view, setView] = useState('current');

    // Static Health Data
    const healthData = {
        activeMinutes: 124,
        caloriesBurned: 350,
        bmi: 24.3,
        steps: 8000,
    };

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const totalDays = daysInMonth(year, month);

    const renderDay = ({ item }) => (
        <View
            style={[
                styles.dayContainer,
                gymDays.includes(item) ? styles.gymDay : null,
            ]}
        >
            <Text style={[styles.dayText, gymDays.includes(item) ? styles.highlightedText : null]}>
                {item}
            </Text>
        </View>
    );

    const weightGains = weightData.currentWeight - weightData.initialWeight;

    const checkActiveTraining = async () => {

        setScreenLoading(true)
        setHasActiveTraining(false)
        setTraining(null)

        const { user } = state;
        try {

            const { data } = await axios.get(`${baseURL}/availTrainer/has-active/${user?.user?._id}`);
            setHasActiveTraining(data.hasActive);
            setTraining(data.training);

        } catch (error) {
            console.log(error)
        }
        setScreenLoading(false)
    }

    useFocusEffect(
        useCallback(() => {

            checkActiveTraining();

        }, [])
    )
    console.log(hasActiveTraining, 'hasTraining')
    console.log(training, 'training')
    return (
        <>
            {screenLoading ? (
                <LoadingScreen />
            ) : (

                <>
                    <StatusBar translucent backgroundColor="transparent" />
                    {hasActiveTraining && training ? (
                        <View style={{ backgroundColor: '#353839', height: '100%' }}>
                            {hasActiveTraining && training && (
                                <SafeAreaView>
                                    <View style={{ flexDirection: 'row', backgroundColor: '#353839', justifyContent: 'center' }}>
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
                                                        <TouchableOpacity onPress={() => setActiveComponent('History')}>
                                                            <MaterialIcons name="create-new-folder" size={24} color="white" />
                                                            <Text style={{ color: 'white', fontSize: 8, marginLeft: 2 }}>History</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity onPress={() => setActiveComponent('Progress')}>
                                                            <MaterialCommunityIcons name="sale" size={24} color="white" style={{ marginLeft: 2 }} />
                                                            <Text style={{ color: 'white', fontSize: 8 }}>Progress</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                                                        <TouchableOpacity onPress={() => setActiveComponent('Statistics')}>
                                                            <AntDesign name="barschart" size={24} color="white" />
                                                            <Text style={{ color: 'white', fontSize: 8, marginLeft: 2 }}>Stats</Text>
                                                        </TouchableOpacity>
                                                        {/* <TouchableOpacity onPress={() => setActiveComponent('Post')}>
                                                            <MaterialIcons name="post-add" size={24} color="white" />
                                                            <Text style={{ color: 'white', fontSize: 8, marginLeft: 2 }}>Post</Text>
                                                        </TouchableOpacity> */}
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>

                                    <View style={{ flexDirection: 'row', gap: 5, padding: 10, }}>
                                        <View style={{ flex: 1, }}>
                                            <Button onPress={() => setView('current')} title='Services Availed'
                                                color={view === 'current' ? '#FFAC1C' : '#AAAAAA'}
                                            />
                                        </View>
                                        <View style={{ flex: 1, }}>
                                            <Button onPress={() => setView('all')} title='Current Service'
                                                color={view === 'all' ? '#FFAC1C' : '#AAAAAA'}
                                            />
                                        </View>
                                    </View>

                                    {view === 'current' && (
                                        <View style={{ padding: 10, marginBottom: 50 }}>
                                            <Text style={{ fontWeight: 900, fontSize: 16, marginBottom: 10, }}>Availed Services</Text>
                                            <ServicesAvailedLists key={hasActiveTraining + "current"} />
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
                                    )}

                                    {view === 'all' && (
                                        <View style={{ marginBottom: 100 }}>
                                            <ClientServiceDetail key={hasActiveTraining + "all"} trainerIdProps={training._id} />
                                        </View>
                                    )}

                                </SafeAreaView >
                            )}
                        </View>
                    ) : (
                        <RNSafeAreaView style={styles.container}>
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
                                                        <TouchableOpacity onPress={() => setActiveComponent('History')}>
                                                            <MaterialIcons name="create-new-folder" size={24} color="white" />
                                                            <Text style={{ color: 'white', fontSize: 8, marginLeft: 2 }}>History</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity onPress={() => setActiveComponent('Progress')}>
                                                            <MaterialCommunityIcons name="sale" size={24} color="white" style={{ marginLeft: 2 }} />
                                                            <Text style={{ color: 'white', fontSize: 8 }}>Progress</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                                                        <TouchableOpacity onPress={() => setActiveComponent('Statistics')}>
                                                            <AntDesign name="barschart" size={24} color="white" />
                                                            <Text style={{ color: 'white', fontSize: 8, marginLeft: 2 }}>Stats</Text>
                                                        </TouchableOpacity>
                                                        {/* <TouchableOpacity onPress={() => setActiveComponent('Post')}>
                                                        <MaterialIcons name="post-add" size={24} color="white" />
                                                        <Text style={{ color: 'white', fontSize: 8, marginLeft: 2 }}>Post</Text>
                                                    </TouchableOpacity> */}
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
        paddingVertical: 10, // Adjust vertical spacing
    },
    dayContainer: {
        width: 40,
        height: 40,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: '#f4f4f4',
    },
    gymDay: {
        backgroundColor: '#4caf50',
    },
    dayText: {
        fontSize: 16,
        color: '#333',
    },
    highlightedText: {
        color: 'white',
        fontWeight: 'bold',
    },
    button: {
        height: 50,
        width: '80%',
        backgroundColor: '#4caf50',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 20,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
});