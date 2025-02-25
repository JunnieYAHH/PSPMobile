import React, { useEffect, useRef, useState } from 'react';
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
    Alert,
    Button,
    Modal
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
import { Picker } from '@react-native-picker/picker';
import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';
import baseURL from '../../../../assets/common/baseUrl';
import SignatureCanvas from "react-native-signature-canvas";

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
    const [sessions, setSessions] = useState("1");
    const [sessionRate, setSessionRate] = useState(500);
    const [total, setTotal] = useState(0);
    const [trainingType, setTrainingType] = useState('');
    const signatureRef = useRef(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [signature, setSignature] = useState(null);

    const calculateRate = (numSessions) => {
        const baseRate = 500;
        numSessions = Number(numSessions) || 1;
        let discountFactor = 0;
        if (numSessions === 6) discountFactor = 1;
        else if (numSessions === 8) discountFactor = 2;
        else if (numSessions === 12) discountFactor = 3;
        else if (numSessions === 18) discountFactor = 4;
        else if (numSessions === 24) discountFactor = 5;
        else if (numSessions === 30) discountFactor = 6;
        else if (numSessions === 50) discountFactor = 7;
        else if (numSessions === 100) discountFactor = 8;
        if (discountFactor === 0) return baseRate;
        let finalRate = baseRate;
        for (let i = 1; i <= discountFactor; i++) {
            const discount = finalRate * 0.025;
            finalRate -= discount;
        }

        return parseFloat(finalRate.toFixed(2));
    };

    //Total Calculation
    useEffect(() => {
        const numSessions = Number(sessions) || 1;
        const rate = calculateRate(numSessions);

        setSessionRate(rate);
        setTotal(parseFloat((numSessions * rate).toFixed(2)));
    }, [sessions]);


    //Avail Training
    const submit = async () => {
        // console.log(sessions)
        // console.log(sessionRate)
        // console.log(total)
        const response = await axios.post(`${baseURL}/availTrainer/avail-trainer-payment-intent`, {
            amount: total,
            currency: 'php',
            userId: user?._id || user?.user?._id,
        });
        // console.log(response.data)

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
            trainingType: trainingType,
            package: selectedPackage,
            signature: signature
        }
        // console.log(data,'DATA')
        try {
            const response = await axios.post(`${baseUrl}/availTrainer/create`, data);
            console.log('Trainer created successfully:', response.data);
            Alert.alert("Succesfully Submitted", "Please Wait for the Confirmation")
            navigation.goBack()
        } catch (error) {
            console.error('Error creating trainer:', error.response ? error.response.data : error.message);
        }
    }

    // Package details
    const packages = [
        { name: 'Personal Training', value: 'personal-training' },
    ];

    //Package Handling
    const handlePackageSelection = (packageName) => {
        setSelectedPackage(packageName === selectedPackage ? '' : packageName);
    };

    const handleSignatureSave = (signature) => {
        setSignature(signature);
        setModalVisible(false);
    };

    const handleClear = () => {
        signatureRef.current.clearSignature();
        setSignature(null);
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
                                        {pkg.name}
                                    </Text>
                                </View>


                            ))}

                            <Text style={[styles.text, { fontSize: 18 }]}>Pricing:</Text>
                            <Text style={[styles.text,]}>Number of Sessions</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={sessions}
                                    onValueChange={(itemValue) => setSessions(itemValue)}
                                    style={styles.picker}
                                    itemStyle={styles.pickerItem}
                                >
                                    {[1, 6, 12, 18, 24, 30, 50, 100].map((value) => (
                                        <Picker.Item key={value} label={`${value}`} value={`${value}`} style={styles.pickerItem} />
                                    ))}
                                </Picker>
                            </View>

                            <Text style={styles.text}>Per Session Rate</Text>
                            <TextInput
                                style={styles.input}
                                value={`₱ ${sessionRate.toFixed(2)}`}
                                editable={false}
                            />

                            <Text style={styles.text}>Total</Text>
                            <TextInput
                                style={styles.input}
                                value={`₱ ${total.toFixed(2)}`}
                                editable={false}
                            />
                            <Text style={styles.text}>Training Type</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={trainingType}
                                    onValueChange={(itemValue) => setTrainingType(itemValue)}
                                    style={styles.picker}
                                    itemStyle={styles.pickerItem}
                                >
                                    {['Health', 'Shape', 'Sports', 'Strength'].map((value) => (
                                        <Picker.Item key={value} label={`${value}`} value={`${value}`} style={{ fontSize: 14 }} />
                                    ))}
                                </Picker>
                            </View>

                            <Button title="Open Signature Pad" onPress={() => setModalVisible(true)} />

                            {/* Show saved signature */}
                            {signature && (
                                <Image source={{ uri: signature }} style={styles.signatureImage} />
                            )}

                            {/* Signature Modal */}
                            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                                <View style={styles.modalBackground}>
                                    <View style={styles.modalContainer}>
                                        <Text style={styles.modalTitle}>Sign Here</Text>
                                        <View style={styles.signatureWrapper}>
                                            <SignatureCanvas
                                                ref={signatureRef}
                                                onOK={handleSignatureSave}
                                                descriptionText="Sign here"
                                                clearText="Clear"
                                                confirmText="Save"
                                                webStyle={`
.m-signature-pad { border: 2px solid #000; height: 100%; }
.m-signature-pad--footer { display: none; }
`}
                                            />
                                        </View>
                                        <View style={styles.buttonRow}>
                                            <TouchableOpacity style={styles.modalButton} onPress={handleClear}>
                                                <Text style={styles.modalButtonText}>Clear</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.modalButton}
                                                onPress={() => signatureRef.current.readSignature()}
                                            >
                                                <Text style={styles.modalButtonText}>Save</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                                                <Text style={styles.modalButtonText}>Close</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </Modal>

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