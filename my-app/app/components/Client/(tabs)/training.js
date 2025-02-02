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

const daysInMonth = (year, month) => new Date(year, month, 0).getDate();

const Training = () => {

    const router = useRouter();
    const state = useSelector(state => state.auth);
    const [gymDays, setGymDays] = useState([2, 5, 9, 12, 16, 20, 23, 27]); // Days when user goes to the gym
    const [weightData] = useState({
        initialWeight: 62, // in kilos
        currentWeight: 65, // in kilos
    });
    const [screenLoading, setScreenLoading] = useState(false);

    const [hasActiveTraining, setHasActiveTraining] = useState(false);
    const [training, setTraining] = useState(null);
    const [view, setView] = useState('current');

    // Static Health Data
    const healthData = {
        activeMinutes: 124, // bpm
        caloriesBurned: 350, // per workout
        bmi: 24.3, // Body Mass Index
        steps: 8000, // steps per day
    };

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // Current month (1-based index)
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

    return (
        <>
            {screenLoading ? (
                <LoadingScreen />
            ) : (

                <>
                    <StatusBar translucent backgroundColor="transparent" />

                    {!hasActiveTraining && !training && (
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

                                    {/* Weight Gain Section */}
                                    <View style={styles.weightSection}>
                                        <Text style={styles.weightHeader}>Weight Progress</Text>
                                        <Text style={styles.weightText}>
                                            Initial Weight: {weightData.initialWeight} kg
                                        </Text>
                                        <Text style={styles.weightText}>
                                            Current Weight: {weightData.currentWeight} kg
                                        </Text>
                                        <Text style={styles.weightText}>
                                            Gain: {weightGains > 0 ? `+${weightGains} kg` : `${weightGains} kg`}
                                        </Text>
                                    </View>

                                    {/* Health Data Section */}
                                    <View style={styles.healthSection}>
                                        <Text style={styles.healthHeader}>Health Data</Text>
                                        <Text style={styles.healthText}>Active minutes per Workout: {healthData.activeMinutes} min</Text>
                                        <Text style={styles.healthText}>Calories Burned per Workout: {healthData.caloriesBurned} kcal</Text>
                                        <Text style={styles.healthText}>BMI: {healthData.bmi}</Text>
                                        <Text style={styles.healthText}>Steps Taken: {healthData.steps} steps</Text>
                                    </View>

                                    <Text style={styles.header}>
                                        Gym Calendar - {today.toLocaleString('default', { month: 'long' })} {year}
                                    </Text>

                                    {/* Calendar Section */}
                                    <FlatList
                                        data={Array.from({ length: totalDays }, (_, i) => i + 1)} // Generate days
                                        keyExtractor={(item) => item.toString()}
                                        numColumns={7} // Calendar grid: 7 columns for 7 days of the week
                                        renderItem={renderDay}
                                        contentContainerStyle={styles.calendarContainer}
                                    />
                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={() => router.push("/components/Client/components/AvailTrainer")}
                                    >
                                        <Text style={styles.buttonText}>Avail Trainer?</Text>
                                    </TouchableOpacity>
                                </View>
                            </ImageBackground>
                        </RNSafeAreaView>
                    )}

                    {hasActiveTraining && training && (
                        <SafeAreaView>

                            <View style={{ flexDirection: 'row', gap: 5, padding: 10, }}>
                                <View style={{ flex: 1, }}>
                                    <Button onPress={() => setView('current')} title='Current Service'
                                        color={view === 'current' ? '#FFAC1C' : '#AAAAAA'}
                                    />
                                </View>
                                <View style={{ flex: 1, }}>
                                    <Button onPress={() => setView('all')} title='Services Availed'
                                        color={view === 'all' ? '#FFAC1C' : '#AAAAAA'}
                                    />
                                </View>
                            </View>

                            {view === 'current' && (
                                <View style={{ marginBottom: 100 }}>
                                    <ClientServiceDetail key={hasActiveTraining + "current"} trainerIdProps={training._id} />
                                </View>
                            )}

                            {view === 'all' && (
                                <View style={{ padding: 10, marginBottom: 50 }}>
                                    <Text style={{ fontWeight: 900, fontSize: 16, marginBottom: 10, }}>Availed Services</Text>
                                    <ServicesAvailedLists key={hasActiveTraining + "all"} />
                                </View>
                            )}

                        </SafeAreaView >
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