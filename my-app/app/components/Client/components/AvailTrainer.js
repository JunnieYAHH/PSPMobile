import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StatusBar,
    ImageBackground,
    TouchableOpacity,
    StyleSheet,
    Image,
    TextInput,
    ScrollView,
    Alert
} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Constants from 'expo-constants';
import { useNavigation } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import baseUrl from '../../../../assets/common/baseUrl';
import styles from '../../styles/Client/ClientTabsAvailTraining';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';
import baseURL from '../../../../assets/common/baseUrl';

const Training = () => {
    const navigation = useNavigation();
    const [showBirthDate, setShowBirthDate] = useState(false);
    const [showEndDate, setShowEndDate] = useState(false);
    const { user } = useSelector((state) => state.auth);

    // State for package selection
    const [selectedPackage, setSelectedPackage] = useState('');
    const [name, setName] = useState(user?.user?.name || user?.name || '');
    const [birthdate, setBirthdate] = useState('');
    const [address, setAddress] = useState(user?.user?.address || user?.address || '');
    const [phone, setPhone] = useState(user?.user?.phone || user?.phone || '');
    const [email, setEmail] = useState(user?.user?.email || user?.email || '');
    const [homePhone, setHomePhone] = useState('');
    const [workPhone, setWorkPhone] = useState('');
    const [sessions, setSessions] = useState('');
    const [sessionRate, setSessionRate] = useState('');
    const [total, setTotal] = useState(0);
    const [endDate, setEndDate] = useState('');

    //Total Calculation
    useEffect(() => {
        const numSessions = parseFloat(sessions) || 0;
        const numSessionRate = parseFloat(sessionRate) || 0; 
        const calculatedTotal = numSessions * numSessionRate;
        setTotal(calculatedTotal);
    }, [sessions, sessionRate]);

    //Avail Training
    const submit = async () => {

        const response = await axios.post(`${baseURL}/availTrainer/avail-trainer-payment-intent`, {
            amount: total,
            currency: 'php',
            userId: user?._id || user?.user?._id,
        });
        console.log(response.data)

        const { clientSecret } = response.data;

        const billingDetails = {
            name: user?.name || user?.user?.name,
            email: user?.email || user?.user?.email,
        };

        await initPaymentSheet({
            paymentIntentClientSecret: clientSecret,
            merchantDisplayName: 'Philippines Sports Performance Fitness Gym',
            defaultBillingDetails: billingDetails,
        });

        const { error } = await presentPaymentSheet();

        if (error) {
            if (error.code === 'Canceled') {
                return false;
            }
            Alert.alert('Error', `Error code: ${error.code}`, error.message);
            console.error('Error presenting payment sheet:', error);
            return false;
        }

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
            total: total,
            endDate: endDate,
            package: selectedPackage,
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

    //Package Handling
    const handlePackageSelection = (packageName) => {
        setSelectedPackage(packageName === selectedPackage ? '' : packageName);
    };

    return (
        <>
            <StatusBar translucent backgroundColor="transparent" />
            <SafeAreaView>
                <ScrollView>
                    <ImageBackground
                        source={require('../../../../assets/ProgramBG.png')}
                        style={styles.backgroundImage}
                        imageStyle={{ opacity: 2.0 }}
                        blurRadius={2}
                        resizeMode="cover"
                    >

                        <View style={styles.overlay}>
                            {/* Form Fields */}
                            <Text style={styles.text}>Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={user?.user?.name || user?.name || 'Enter your name'}
                                onChangeText={(value) => setName(value)}
                                value={name}
                            />
                            <Text style={styles.text}>Birth Date</Text>
                            <TouchableOpacity
                                onPress={() => setShowBirthDate(true)}
                                style={[styles.input, { justifyContent: "center" }]}
                            >
                                <Text style={{
                                    fontSize: 14,
                                    color: '#000',
                                    marginTop: 3,
                                }}>
                                    {birthdate ? birthdate.toLocaleDateString() : "Select a date"}
                                </Text>
                            </TouchableOpacity>
                            {showBirthDate && (
                                <DateTimePicker
                                    value={birthdate || new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        if (event.type === 'set') {
                                            setShowBirthDate(false);
                                            setBirthdate(selectedDate);
                                        } else {
                                            setShowBirthDate(false);
                                        }
                                    }}
                                />
                            )}
                            <Text style={styles.text}>Address</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={user?.user?.address || user?.address || 'Please enter your address'}
                                onChangeText={(value) => setAddress(value)}
                                value={address}
                            />
                            <Text style={styles.text}>Cellphone Number</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={user?.user?.phone || user?.phone || "Enter Cellphone Num.."}
                                onChangeText={(value) => setPhone(value)}
                                value={phone}
                            />
                            <Text style={styles.text}>Email</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={user?.user?.email || user?.email || "Enter your Email"}
                                onChangeText={(value) => setEmail(value)}
                                value={email}
                            />
                            <Text style={styles.text}>Home Phone</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your Home Phone"
                                onChangeText={(value) => setHomePhone(value)}
                                value={homePhone}
                            />
                            <Text style={styles.text}>Work Phone</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your Work Phone"
                                onChangeText={(value) => setWorkPhone(value)}
                                value={workPhone}
                            />

                            {/* Package Selection */}
                            <Text style={styles.text}>Choose Package</Text>
                            {packages.map((pkg) => (
                                <View
                                    key={pkg.name}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        width: "100%",
                                        marginBottom: 10,
                                        marginTop: 5
                                    }}
                                >
                                    <TouchableOpacity onPress={() => handlePackageSelection(pkg.value)}>
                                        <FontAwesome
                                            name={selectedPackage === pkg.value ? "check-square" : "square-o"}
                                            size={24}
                                            color={selectedPackage === pkg.value ? "#00FFFF" : "white"}
                                        />
                                    </TouchableOpacity>
                                    <Text style={{ marginLeft: 10, color: 'white', marginTop: 3 }}>
                                        {pkg.name} - {pkg.price}
                                    </Text>
                                </View>


                            ))}

                            <Text style={[styles.text, { fontSize: 18 }]}>Pricing:</Text>
                            <Text style={[styles.text,]}>Number of Sessions</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Number of Sessions"
                                onChangeText={(value) => setSessions(value)}
                                value={sessions}
                                keyboardType="numeric"
                            />
                            <Text style={styles.text}>Per Session Rate</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Per Session Rate"
                                onChangeText={(value) => setSessionRate(value)}
                                value={sessionRate}
                                keyboardType="numeric"
                            />
                            <Text style={styles.text}>Total</Text>
                            <TextInput
                                style={styles.input}
                                value={`₱ ${total.toFixed(2)}`}
                                editable={false}
                            />
                            <Text style={styles.text}>Final Session Date</Text>
                            <TouchableOpacity
                                onPress={() => setShowEndDate(true)}
                                style={[styles.input, { justifyContent: "center" }]}
                            >
                                <Text style={{
                                    fontSize: 14,
                                    color: '#000',
                                    marginTop: 3,
                                }}>
                                    {endDate ? endDate.toLocaleDateString() : "Select a date"}
                                </Text>
                            </TouchableOpacity>
                            {showEndDate && (
                                <DateTimePicker
                                    value={endDate || new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        if (event.type === 'set') {
                                            setShowEndDate(false);
                                            setEndDate(selectedDate);
                                        } else {
                                            setShowEndDate(false);
                                        }
                                    }}
                                />
                            )}
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: selectedPackage ? "#FFAC1C" : "#ccc" }]}
                                disabled={!selectedPackage}
                                onPress={submit}
                            >
                                <Text style={styles.buttonText}>
                                    Submit
                                </Text>
                            </TouchableOpacity>
                        </View>

                    </ImageBackground>
                </ScrollView>
            </SafeAreaView>
        </>
    )
}

export default Training