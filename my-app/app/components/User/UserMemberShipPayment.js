import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, StatusBar, ImageBackground, TouchableOpacity, Image, Alert, TextInput, Button, Modal } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation, useRouter } from 'expo-router';
import { getAllBranch } from '../../(services)/api/Branches/getAllBranch';
import { getAllTransactions } from '../../(services)/api/Transactions/getAllTransactions';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MembershipPayment } from '../../(services)/api/Users/membershipPayment';
import { createSubscription, loadClientSecret } from '../../(redux)/paymentSlice';
import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import LoadingScreen from '../LodingScreen';
import Constants from 'expo-constants';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import SignatureCanvas from "react-native-signature-canvas";

const UserMemberShipPayment = () => {
    const navigation = useNavigation();
    const scrollViewRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter()
    const dispatch = useDispatch();
    const animation = useRef(null)
    const { user } = useSelector((state) => state.auth);
    const userId = user.user._id;
    const [promo, setPromo] = useState('');
    const [stripeSubscriptionId, setStripeSubscriptionId] = useState('');
    const signatureRef = useRef(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [termsConditionVisible, setTermsConditionVisible] = useState(false);
    const [signature, setSignature] = useState(null);

    // Get All branches and transactions
    const [branches, setBranches] = useState([]);
    const [transactions, setAllTransactions] = useState([]);
    const [availablePromos, setAvailablePromos] = useState({
        december: true,
        newYear: true,
        summer: true,
    });
    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                const branchData = await getAllBranch();
                setBranches(branchData.branch);

                const transactionData = await getAllTransactions();
                setAllTransactions(transactionData.transactions);

                checkPromoAvailability(transactionData.transactions);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
        return () => {
            isMounted = false;
        };
    }, []);

    //State for date
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false);
        setDate(currentDate);
        setFieldValue("birthDate", currentDate);
    };

    //Promo
    const checkPromoAvailability = (transactions) => {
        const currentYear = new Date().getFullYear();

        // Count transactions by promo within the current year
        const promoCounts = {
            "December Promo": 0,
            "New Year's Promo": 0,
            "Summer Promo": 0,
        };

        transactions.forEach(transaction => {
            const transactionYear = new Date(transaction.createdAt).getFullYear();
            if (transactionYear === currentYear) {
                if (promoCounts[transaction.promo] !== undefined) {
                    promoCounts[transaction.promo]++;
                }
            }
        });

        // Update availability based on the count
        setAvailablePromos({
            december: promoCounts["December Promo"] < 15,
            newYear: promoCounts["New Year's Promo"] < 15,
            summer: promoCounts["Summer Promo"] < 15,
        });
    };

    const today = new Date();
    const month = today.getMonth();

    useEffect(() => {
        dispatch(loadClientSecret());
    }, [dispatch]);
    // console.log(user.user.name)

    const handlePayment = async (clientSecret) => {
        const billingDetails = {
            name: user.user.name,
            email: user.user.email,
        };

        try {
            const { error: paymentSheetError } = await initPaymentSheet({
                merchantDisplayName: 'Philippines Sports Performance Fitness Gym',
                paymentIntentClientSecret: clientSecret,
                defaultBillingDetails: billingDetails,
            });

            if (paymentSheetError) {
                Alert.alert('Error', paymentSheetError.message);
                console.error('Error initializing payment sheet:', paymentSheetError);
                return false;
            }

            // Present Payment Sheet
            const { error: paymentError } = await presentPaymentSheet();

            if (paymentError) {
                if (paymentError.code === 'Canceled') {
                    return false;
                }
                Alert.alert('Error', `Error code: ${paymentError.code}`, paymentError.message);
                console.error('Error presenting payment sheet:', paymentError);
                return false;
            }

            return true;
        } catch (err) {
            Alert.alert('Error', err.message);
            console.error('Error creating subscription:', err);
            return false;
        }
    };

    const handleSignatureSave = (signature) => {
        setSignature(signature);
        setModalVisible(false);
    };

    const handleClear = () => {
        signatureRef.current.clearSignature();
        setSignature(null);
    };

    // console.log(signature)

    return (
        <>
            {isLoading ? (
                <LoadingScreen />
            ) : (
                <>
                    <StatusBar translucent backgroundColor="transparent" />
                    <View style={styles.container}>
                        <ImageBackground
                            source={require('../../../assets/ProgramBG.png')}
                            style={styles.backgroundImage}
                            imageStyle={{ opacity: 1.5 }}
                            blurRadius={2}
                        >
                            <SafeAreaView style={styles.safeAreaView}>
                                {/* Content Header */}
                                <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
                                    <View style={{ justifyContent: 'center' }}>
                                        <TouchableOpacity onPress={() => navigation.goBack()}>
                                            <AntDesign name="back" size={24} color="white" style={{ marginLeft: 25, fontWeight: 'bold', marginTop: 30, position: 'relative' }} />
                                        </TouchableOpacity>
                                        <Image source={require('../../../assets/backroundMovable.png')} style={{ alignSelf: 'center', marginRight: 10 }} />
                                    </View>
                                    <View style={styles.headerContainer}>
                                        <Text style={styles.headerText}>Please Fill in the form in Block Lettters</Text>
                                        <Formik
                                            initialValues={{
                                                userBranch: "", birthDate: date, address: "", emergencyContactName: "",
                                                emergencyContactNumber: "", promo: '', agreeTerms: false, phone: '', city: '', signature: ""
                                            }}
                                            onSubmit={async (values) => {
                                                try {
                                                    const response = await dispatch(
                                                        createSubscription({ userId: user.user._id || user._id, promo: values.promo })
                                                    ).unwrap();

                                                    setStripeSubscriptionId(response.stripeSubscriptionId);

                                                    // Call handlePayment and check if it was successful
                                                    const paymentSuccessful = await handlePayment(response.clientSecret);

                                                    if (!paymentSuccessful) {
                                                        return;
                                                    }


                                                    setIsLoading(true);
                                                    const paymentResponse = await MembershipPayment({
                                                        ...values,
                                                        userId: user.user._id || user._id,
                                                        stripeSubscriptionId: response.stripeSubscriptionId,
                                                        signature: signature,
                                                    });

                                                    Alert.alert(
                                                        "You are now Subscribed",
                                                        "Proceed to answer the Physical Activity Readiness Questionnaire",
                                                        [
                                                            {
                                                                text: "OK",
                                                                onPress: () => {
                                                                    setIsLoading(false);
                                                                    router.replace("/components/Client/Form");
                                                                },
                                                            },
                                                        ]
                                                    );
                                                } catch (error) {
                                                    console.log('Caught Error:', error);
                                                    console.error('Formik clickable failed:', error.message);
                                                }
                                            }}
                                        >
                                            {({
                                                handleChange,
                                                handleBlur,
                                                handleSubmit,
                                                values,
                                                errors,
                                                touched,
                                                setFieldValue,
                                            }) => (
                                                <View style={styles.form}>
                                                    <Text style={styles.text}>Branch Application</Text>
                                                    <View style={styles.pickerContainer}>
                                                        <FontAwesome name="building" size={24} color="black" style={{ alignItems: 'center', marginRight: 5, marginLeft: 5 }} />
                                                        <Picker
                                                            style={styles.picker}
                                                            selectedValue={values.userBranch}
                                                            onValueChange={(itemValue) => {
                                                                handleChange("userBranch")(itemValue);
                                                                handleBlur("userBranch");
                                                            }}
                                                            itemStyle={styles.pickerItem}
                                                        >
                                                            <Picker.Item label="Select a Branch" value="" style={styles.pickerItem} />
                                                            {branches.map((branch) => (
                                                                <Picker.Item key={branch._id} label={branch.name} value={branch._id} style={styles.pickerItem} />
                                                            ))}
                                                        </Picker>
                                                        {errors.userBranch && touched.userBranch && (
                                                            <Text style={styles.errorText}>{errors.userBranch}</Text>
                                                        )}
                                                    </View>

                                                    <Text style={styles.text}>Birth Date</Text>
                                                    <View style={{ backgroundColor: '#f9f1f1', height: 50, borderRadius: 10, alignItems: 'center', flexDirection: 'row', width: '75%' }}>
                                                        <FontAwesome name="birthday-cake" size={24} color="black" style={{ alignItems: 'center', marginRight: 5, marginLeft: 5 }} />
                                                        <TouchableOpacity onPress={() => setShow(true)} style={{
                                                            backgroundColor: '#fff',
                                                            borderRadius: 8,
                                                            width: '50%',
                                                            height: 40,
                                                            width: 200,
                                                            marginLeft: 10
                                                        }}>
                                                            <Text style={{
                                                                fontSize: 14,
                                                                color: '#000',
                                                                marginTop: 8,
                                                                padding: 5,
                                                                textAlign: 'center',
                                                            }}>
                                                                {values.birthDate ? values.birthDate.toLocaleDateString() : "Select a date"}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>

                                                    {show && (
                                                        <DateTimePicker
                                                            value={values.birthDate || new Date()}
                                                            mode="date"
                                                            display="default"
                                                            onChange={(event, selectedDate) => {
                                                                if (event.type === 'set') {
                                                                    setShow(false);
                                                                    setFieldValue("birthDate", selectedDate);
                                                                } else {
                                                                    setShow(false);
                                                                }
                                                            }}
                                                        />
                                                    )}

                                                    <Text style={styles.text}>Address</Text>
                                                    <View style={styles.inputContainer}>
                                                        <Entypo name="address" size={24} color="black" style={{ alignItems: 'center', marginRight: 5, marginLeft: 5 }} />
                                                        <TextInput
                                                            style={styles.input}
                                                            placeholder="Address"
                                                            onChangeText={handleChange("address")}
                                                            onBlur={handleBlur("address")}
                                                            value={values.address}
                                                        />
                                                    </View>
                                                    {errors.address && touched.address && (
                                                        <Text style={styles.errorText}>{errors.address}</Text>
                                                    )}

                                                    <Text style={styles.text}>City</Text>
                                                    <View style={styles.inputContainer}>
                                                        <FontAwesome5 name="city" size={24} color="black" style={{ alignItems: 'center', marginRight: 5, marginLeft: 5 }} />
                                                        <TextInput
                                                            style={styles.input}
                                                            placeholder="City"
                                                            onChangeText={handleChange("city")}
                                                            onBlur={handleBlur("city")}
                                                            value={values.city}
                                                        />
                                                    </View>
                                                    {errors.city && touched.city && (
                                                        <Text style={styles.errorText}>{errors.city}</Text>
                                                    )}

                                                    <Text style={styles.text}>Phone</Text>
                                                    <View style={styles.inputContainer}>
                                                        <Feather name="phone-call" size={24} color="black" style={{ alignItems: 'center', marginRight: 5, marginLeft: 5 }} />
                                                        <TextInput
                                                            style={styles.input}
                                                            placeholder="Phone"
                                                            onChangeText={handleChange("phone")}
                                                            onBlur={handleBlur("phone")}
                                                            value={values.phone}
                                                        />
                                                    </View>
                                                    {errors.phone && touched.phone && (
                                                        <Text style={styles.errorText}>{errors.phone}</Text>
                                                    )}

                                                    <Text style={styles.text}>Emergency Contact Name</Text>
                                                    <View style={styles.inputContainer}>
                                                        <MaterialIcons name="person-pin" size={27} color="black" style={{ alignItems: 'center', marginRight: 5, marginLeft: 5 }} />
                                                        <TextInput
                                                            style={styles.input}
                                                            placeholder="Emergency Contact Name"
                                                            onChangeText={handleChange("emergencyContactName")}
                                                            onBlur={handleBlur("emergencyContactName")}
                                                            value={values.emergencyContactName}
                                                        />
                                                    </View>
                                                    {errors.emergencyContactName && touched.emergencyContactName && (
                                                        <Text style={styles.errorText}>{errors.emergencyContactName}</Text>
                                                    )}

                                                    <Text style={styles.text}>Emergency Contact Phone</Text>
                                                    <View style={styles.inputContainer}>
                                                        <Feather name="phone-call" size={24} color="black" style={{ alignItems: 'center', marginRight: 5, marginLeft: 5 }} />
                                                        <TextInput
                                                            style={styles.input}
                                                            placeholder="Emergency Contact Number"
                                                            onChangeText={handleChange("emergencyContactNumber")}
                                                            onBlur={handleBlur("emergencyContactNumber")}
                                                            value={values.emergencyContactNumber}
                                                        />
                                                    </View>
                                                    {errors.emergencyContactNumber && touched.emergencyContactNumber && (
                                                        <Text style={styles.errorText}>{errors.emergencyContactNumber}</Text>
                                                    )}
                                                    <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                                                        <Text style={styles.buttonText}>Open Signature Pad</Text>
                                                    </TouchableOpacity>

                                                    {/* Show saved signature */}
                                                    {signature && (
                                                        <View style={{
                                                            backgroundColor: 'white',
                                                            borderRadius: 40,
                                                            padding: 10,
                                                            width: 300,
                                                            alignSelf: 'center'
                                                        }}>
                                                            <View style={{
                                                                borderWidth: 1,
                                                                borderColor: "#000",
                                                                borderRadius: 100
                                                            }}>
                                                                <Image source={{ uri: signature }} style={styles.signatureImage} />
                                                            </View>
                                                        </View>
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
                                                    {/* Ber Months Promo Promo */}
                                                    {(availablePromos.december && month >= 8) ? (
                                                        <View style={styles.promo}>
                                                            <TouchableOpacity onPress={() => setFieldValue('promo', values.promo === "December Promo" ? '' : "December Promo")}>
                                                                <FontAwesome
                                                                    name={values.promo === "December Promo" ? "check-square" : "square-o"}
                                                                    size={24}
                                                                    color={values.promo === "December Promo" ? "#00FFFF" : "white"}
                                                                />
                                                            </TouchableOpacity>
                                                            <Text style={{ marginLeft: 10, color: 'white' }}>December Promo</Text>
                                                        </View>
                                                    ) : (
                                                        <Text style={styles.noPromoText}></Text>
                                                    )}

                                                    {/* New Year's Promo (only in January) */}
                                                    {(availablePromos.newYear && month === 0) ? (
                                                        <View style={styles.promo}>
                                                            <TouchableOpacity onPress={() => setFieldValue('promo', values.promo === "New Year's Promo" ? '' : "New Year's Promo")}>
                                                                <FontAwesome
                                                                    name={values.promo === "New Year's Promo" ? "check-square" : "square-o"}
                                                                    size={24}
                                                                    color={values.promo === "New Year's Promo" ? "#00FFFF" : "white"}
                                                                />
                                                            </TouchableOpacity>
                                                            <Text style={{ marginLeft: 10, color: 'white' }}>New Year's Promo</Text>
                                                        </View>
                                                    ) : (
                                                        <Text style={styles.noPromoText}></Text>
                                                    )}

                                                    {/* Summer Promo (only in June to August) */}
                                                    {(availablePromos.summer && month >= 5 && month <= 7) ? (
                                                        <View style={styles.promo}>
                                                            <TouchableOpacity onPress={() => setFieldValue('promo', values.promo === "Summer Promo" ? '' : "Summer Promo")}>
                                                                <FontAwesome
                                                                    name={values.promo === "Summer Promo" ? "check-square" : "square-o"}
                                                                    size={24}
                                                                    color={values.promo === "Summer Promo" ? "#00FFFF" : "white"}
                                                                />
                                                            </TouchableOpacity>
                                                            <Text style={{ marginLeft: 10, color: 'white' }}>Summer Promo</Text>
                                                        </View>
                                                    ) : (
                                                        <Text style={styles.noPromoText}></Text>
                                                    )}

                                                    <View style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        marginBottom: 10,
                                                        marginTop: 15
                                                    }}>
                                                        <TouchableOpacity onPress={() => setFieldValue('agreeTerms', !values.agreeTerms)}>
                                                            <FontAwesome
                                                                name={values.agreeTerms ? "check-square" : "square-o"}
                                                                size={24}
                                                                color={values.agreeTerms ? "#00FFFF" : "white"}
                                                            />
                                                        </TouchableOpacity>

                                                        <TouchableOpacity onPress={() => setTermsConditionVisible(true)}>
                                                            <Text style={{ marginLeft: 10, color: 'white', marginTop: 3 }}>
                                                                Accept Terms and Conditions
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>

                                                    <Modal
                                                        animationType="slide"
                                                        transparent={true}
                                                        visible={termsConditionVisible}
                                                        onRequestClose={() => setTermsConditionVisible(false)}
                                                    >
                                                        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', padding: 20, justifyContent: 'center' }}>
                                                            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, maxHeight: '80%' }}>
                                                                <ScrollView>
                                                                    <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>
                                                                        Terms and Conditions for PSP Fitness Gym.
                                                                    </Text>
                                                                    <Text style={{ fontSize: 14 }}>
                                                                        Welcome to the PSP Fitness Gym Application. By downloading the App, you agree to comply with and also be bound by the following Terms and Conditions. Please review and read them carefully before using the Application. If you do not agree to these terms, you should not use the Application.

                                                                        {'\n\n'}1. You must be at least 18 years old to use the application.
                                                                        {'\n\n'}2. To access certain features of the application, you may need to register and create an account. You are responsible on maintaining the confidentiality of your account information and for all activities that occur under your account.
                                                                        {'\n\n'}3. There are limited features when you finished creating your own account, to view more features, you need to subscribe for the membership of the PSP Fitness Gym application.
                                                                        {'\n\n'}4. The app offer gym memberships plan that provide access to gym services.
                                                                        {'\n\n'}5. The app also offers booking of your own personal trainer/coach which is separate on the gym membership fee.
                                                                        {'\n\n'}6. If you are going to apply to become a member of the PSP Fitness Gym, the app collects personal information such as your name, age, email, address, phone number, signature, and it also collects your physical activity readiness to see if you have medical conditions before becoming a member of the PSP Fitness Gym.
                                                                        {'\n\n'}7. You can pay through this app with the following payment methods: Mastercard, VISA, BDO, Maya, or pay through personal by visiting the PSP Fitness Gym Taguig Jr.
                                                                        {'\n\n'}8. There are no reservations of the gym equipment.
                                                                        {'\n\n'}9. Member or not, you can visit the PSP Fitness Gym Taguig Jr. to see the gym facility by yourself.
                                                                    </Text>
                                                                </ScrollView>

                                                                <TouchableOpacity
                                                                    style={{ marginTop: 20, alignSelf: 'flex-end' }}
                                                                    onPress={() => setTermsConditionVisible(false)}
                                                                >
                                                                    <Text style={{ color: '#007AFF', fontWeight: 'bold' }}>Close</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                                    </Modal>

                                                    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                                                        <Text style={styles.buttonText}>Pay</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            )}
                                        </Formik>
                                    </View>
                                </ScrollView>
                            </SafeAreaView>
                        </ImageBackground>
                    </View>
                </>
            )}
        </>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
    },
    backgroundImage: {
        flex: 1,
    },
    safeAreaView: {
        flex: 1,
    },
    headerContainer: {
        marginHorizontal: 16,
        marginTop: 30,
        // backgroundColor: 'white',
        borderRadius: 30,
        marginTop: 20,
    },
    headerText: {
        fontSize: 12,
        fontWeight: '100',
        color: 'white',
        marginLeft: 2,
        padding: 10,
        marginTop: 8,
    },
    form: {
        width: "100%",
        borderRadius: 10,
        // padding: 20,
    },
    pickerContainer: {
        borderRadius: 10,
        overflow: 'hidden',
        borderColor: '#ccc',
        backgroundColor: '#f9f1f1',
        height: 60,
        width: 450,
        flexDirection: 'row',
        alignItems: 'center'
    },
    picker: {
        height: 40,
        width: 450,
        width: "70%",
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 16,
        backgroundColor: "#fff",
    },
    pickerItem: {
        fontSize: 12,
    },
    text: {
        color: 'white',
        marginBottom: 5,
        marginTop: 15,
    },
    errorText: {
        color: "red",
        marginBottom: 16,
    },
    inputContainer: {
        backgroundColor: '#f9f1f1',
        height: 50,
        borderRadius: 10,
        alignItems: 'center',
        flexDirection: 'row',
        width: '80%'
    },
    input: {
        height: 40,
        width: '80%',
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        backgroundColor: "#fff",
    },
    promo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 15
    },
    button: {
        height: 50,
        backgroundColor: "#6200ea",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        marginTop: 16,
        marginBottom: 40
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    modalBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
        width: "90%",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    signatureWrapper: {
        width: "100%",
        height: 300,
        borderWidth: 2,
        borderColor: "#000",
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    modalButton: {
        backgroundColor: "#007BFF",
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    closeButton: {
        backgroundColor: "#FF0000",
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    modalButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    signatureImage: {
        width: 100,
        height: 50,
        marginTop: 20,
        marginBottom: 20,
        alignSelf: 'center'
    },
});

export default UserMemberShipPayment