import React, { useState } from 'react';
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
import axios from 'axios';
import { useSelector } from 'react-redux';

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

    const billingMethods = [
        { name: 'Paid in Full', value: 'paid-in-full' },
        { name: 'Bank Account', value: 'bank-accont' },
        { name: 'Cash', value: 'cash' },
        { name: 'Check', value: 'check' },
    ];
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
                            />
                            <Text style={[styles.text,]}>Per Session Rate</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Number Per Session Rate"
                                onChangeText={(value) => setSessionRate(value)}
                                value={sessionRate}
                            />
                            <Text style={[styles.text,]}>Total</Text>
                            <TextInput
                                style={styles.input}
                                value={(sessions) * (sessionRate)}
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

                            <Text style={styles.text}>Terms-Payment Plan</Text>
                            {payment.map((pay) => (
                                <View
                                    key={pay.name}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        width: "100%",
                                        marginBottom: 10,
                                        marginTop: 5
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() => setSelectedPayment(pay.value)}
                                    >
                                        <FontAwesome
                                            name={selectedPayment === pay.value ? "check-square" : "square-o"}
                                            size={24}
                                            color={selectedPayment === pay.value ? "#00FFFF" : "white"}
                                        />
                                    </TouchableOpacity>
                                    <Text style={{ marginLeft: 10, color: 'white', marginTop: 3 }}>
                                        {pay.name}
                                    </Text>
                                </View>
                            ))}

                            <Text style={[styles.text, { fontSize: 18 }]}>Billing Method</Text>
                            {billingMethods.map((billing) => (
                                <View
                                    key={billing.name}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        width: "100%",
                                        marginBottom: 10,
                                        marginTop: 5
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() => setSelectedBilling(billing.value)}
                                    >
                                        <FontAwesome
                                            name={selectedBilling === billing.value ? "check-square" : "square-o"}
                                            size={24}
                                            color={selectedBilling === billing.value ? "#00FFFF" : "white"}
                                        />
                                    </TouchableOpacity>
                                    <Text style={{ marginLeft: 10, color: 'white', marginTop: 3 }}>
                                        {billing.name}
                                    </Text>
                                </View>
                            ))}

                            {/* Confirm Button */}
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
        marginTop: 20,
        justifyContent: "space-around",
        alignItems: "center",
        padding: 16,
    },
    input: {
        height: 50,
        width: "100%",
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 16,
        backgroundColor: "#fff",
    },
    text: {
        textAlign: "left",
        width: "100%",
        marginBottom: 5,
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    button: {
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        marginTop: 16,
        width: '100%',
    },
    buttonText: {
        color: "black",
        fontSize: 18,
        fontWeight: "bold",
    },
})