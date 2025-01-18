import React, { useState } from 'react';
import {
    View,
    Text,
    StatusBar,
    ImageBackground,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';

const daysInMonth = (year, month) => new Date(year, month, 0).getDate();

const Training = () => {
    const navigation = useNavigation();
    const [showBirthDate, setShowBirthDate] = useState(false);
    const [showEndDate, setShowEndDate] = useState(false);
    const { user } = useSelector((state) => state.auth);

    // State for package selection
    const [selectedPackage, setSelectedPackage] = useState('');
    const [selectedPayment, setSelectedPayment] = useState('');
    const [selectedBilling, setSelectedBilling] = useState('');
    const [name, setName] = useState(user?.user?.name || user?.name || '');
    const [birthdate, setBirthdate] = useState('');
    const [address, setAddress] = useState(user?.user?.address || user?.address || '');
    const [phone, setPhone] = useState(user?.user?.phone || user?.phone || '');
    const [email, setEmail] = useState(user?.user?.email || user?.email || '');
    const [homePhone, setHomePhone] = useState('');
    const [workPhone, setWorkPhone] = useState('');
    const [sessions, setSessions] = useState('');
    const [sessionRate, setSessionRate] = useState('');
    const [endDate, setEndDate] = useState('');
    const submit = async () => {
        const data = {
            userId: user?.user?._id || user?._id,
            name: name,
            birthdate: birthdate,
            address: address,
            phone: phone,
            email: email,
            homePhone: homePhone,
            workPhone: workPhone,
            sessions: sessions,
            sessionRate: sessionRate,
            endDate: endDate,
            package: selectedPackage,
            payment: selectedPayment,
            billing: selectedBilling,
        }
        console.log(data)
        try {
            const response = await axios.post(`${baseUrl}/availTrainer`, data);
            console.log('Trainer created successfully:', response.data);
            Alert.alert("Succesfully Submitted", "Please Wait for the Confirmation")
            navigation.goBack()
        } catch (error) {
            console.error('Error creating trainer:', error.response ? error.response.data : error.message);
        }
    }

    // Package details
    const packages = [
        { name: 'Boot Camp', price: '₱5000', value: 'boot-camp' },
        { name: 'Lifestyle Training', price: '₱4000', value: 'lifestyle-training' },
        { name: 'Goal Based Training', price: '₱4500', value: 'goal-based-training' },
        { name: 'Personal Training', price: '₱6000', value: 'personal-training' },
    ];

    const handlePackageSelection = (packageName) => {
        setSelectedPackage(packageName === selectedPackage ? '' : packageName);
    };

    const payment = [
        { name: 'Paid in Full', value: 'paid-in-full' },

    ];

    const weightGains = weightData.currentWeight - weightData.initialWeight;

    return (
        <>
            <StatusBar translucent backgroundColor="transparent" />
            <SafeAreaView style={styles.container}>
                <ImageBackground
                    source={require('../../../../assets/ProgramBG.png')}
                    style={styles.backgroundImage}
                    imageStyle={{ opacity: 0.7 }}
                    blurRadius={2}
                    resizeMode="cover"
                >
                    <View style={styles.overlay}>
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
            </SafeAreaView>
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
