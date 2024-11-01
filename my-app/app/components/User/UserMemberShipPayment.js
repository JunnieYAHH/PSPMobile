import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, StatusBar, ImageBackground, TouchableOpacity, Image, Alert, TextInput } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation, useRouter } from 'expo-router';
import { getAllBranch } from '../../(services)/api/Branches/getAllBranch';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from '../styles/CompUserMemberPaymentStyle';
import { MembershipPayment } from '../../(services)/api/Users/membershipPayment';
import { createSubscription, loadClientSecret } from '../../(redux)/paymentSlice';
import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';

const UserMemberShipPayment = () => {
    const navigation = useNavigation();
    const scrollViewRef = useRef(null);
    const router = useRouter()
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const userId = user.user._id;
    const [promo, setPromo] = useState('');
    const [stripeSubscriptionId, setStripeSubscriptionId] = useState('');
    // console.log(stripeSubscriptionId)

    // Get All branches
    const [branches, setBranches] = useState([]);
    useEffect(() => {
        let isMounted = true;

        const fetchBranch = async () => {
            try {
                const data = await getAllBranch();
                // console.log(data.)
                if (isMounted) {
                    setBranches(data.branch);
                }
            } catch (error) {
                if (isMounted) {
                    console.error("Error fetching branch:", error);
                }
            }
        };
        fetchBranch();

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
    const [isChecked, setIsChecked] = useState(false);
    const today = new Date();
    const month = today.getMonth();
    const showDecemberPromo = (month >= 8);
    const showSummerPromo = (month >= 5 && month <= 7);
    const showNewYearsPromo = (month === 0);

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
                return;
            }

            // Present Payment Sheet
            const { error: paymentError } = await presentPaymentSheet();

            if (paymentError) {
                if (paymentError.code === 'Canceled') {
                    return;
                }
                Alert.alert('Error', `Error code: ${paymentError.code}`, paymentError.message);
                console.error('Error presenting payment sheet:', paymentError);
            } else {
                Alert.alert('Success', 'Subscription completed successfully!');
            }

            if (!paymentError) {
                router.replace("/components/Client/(tabs)");
            } else {
                console.log("Payment error:", paymentError);
            }
        } catch (err) {
            Alert.alert('Error', err.message);
            console.error('Error creating subscription:', err);
        }
    };

    return (
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
                                        emergencyContactNumber: "", promo: '', agreeTerms: false, phone: '', city: ''
                                    }}
                                    onSubmit={async (values) => {
                                        // setIsLoading(true);
                                        // console.log("Formik Values", values)
                                        try {
                                            const response = await dispatch(
                                                createSubscription({ userId: user.user._id, promo: values.promo })
                                            ).unwrap();
                                            // console.log('Subscription Response:', response);

                                            setStripeSubscriptionId(response.stripeSubscriptionId)

                                            await handlePayment(response.clientSecret);

                                            // console.log('stripeSubscriptionId in screen', response.stripeSubscriptionId)
                                            const paymentResponse = await MembershipPayment({
                                                ...values,
                                                userId: user.user._id,
                                                stripeSubscriptionId: response.stripeSubscriptionId,
                                            });
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
                                            <TouchableOpacity onPress={() => setShow(true)} style={{
                                                backgroundColor: '#fff',
                                                borderRadius: 10,
                                                width: '50%',
                                                height: 18,
                                            }}>
                                                <Text style={{
                                                    fontSize: 12,
                                                    color: '#000',
                                                    marginTop: 3,
                                                    textAlign: 'center'
                                                }}>
                                                    {values.birthDate ? values.birthDate.toLocaleDateString() : "Select a date"}
                                                </Text>
                                            </TouchableOpacity>

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
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Address"
                                                onChangeText={handleChange("address")}
                                                onBlur={handleBlur("address")}
                                                value={values.address}
                                            />
                                            {errors.address && touched.address && (
                                                <Text style={styles.errorText}>{errors.address}</Text>
                                            )}

                                            <Text style={styles.text}>City</Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="City"
                                                onChangeText={handleChange("city")}
                                                onBlur={handleBlur("city")}
                                                value={values.city}
                                            />
                                            {errors.city && touched.city && (
                                                <Text style={styles.errorText}>{errors.city}</Text>
                                            )}

                                            <Text style={styles.text}>Phone</Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Phone"
                                                onChangeText={handleChange("phone")}
                                                onBlur={handleBlur("phone")}
                                                value={values.phone}
                                            />
                                            {errors.phone && touched.phone && (
                                                <Text style={styles.errorText}>{errors.phone}</Text>
                                            )}

                                            <Text style={styles.text}>Emergency Contact Name</Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Emergency Contact Name"
                                                onChangeText={handleChange("emergencyContactName")}
                                                onBlur={handleBlur("emergencyContactName")}
                                                value={values.emergencyContactName}
                                            />
                                            {errors.emergencyContactName && touched.emergencyContactName && (
                                                <Text style={styles.errorText}>{errors.emergencyContactName}</Text>
                                            )}

                                            <Text style={styles.text}>Emergency Contact Phone</Text>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="Emergency Contact Number"
                                                onChangeText={handleChange("emergencyContactNumber")}
                                                onBlur={handleBlur("emergencyContactNumber")}
                                                value={values.emergencyContactNumber}
                                            />
                                            {errors.emergencyContactNumber && touched.emergencyContactNumber && (
                                                <Text style={styles.errorText}>{errors.emergencyContactNumber}</Text>
                                            )}
                                            {/* Ber Months Promo Promo */}
                                            {showDecemberPromo && (
                                                <View style={styles.promo}>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            const newPromo = promo === "December Promo" ? '' : "December Promo";
                                                            setPromo(newPromo);
                                                            setFieldValue('promo', newPromo);
                                                        }}
                                                    >
                                                        <FontAwesome
                                                            name={values.promo === "December Promo" ? "check-square" : "square-o"}
                                                            size={24}
                                                            color={values.promo === "December Promo" ? "#00FFFF" : "white"}
                                                        />
                                                    </TouchableOpacity>
                                                    <Text style={{ marginLeft: 10, color: 'white' }}>December Promo</Text>
                                                </View>
                                            )}

                                            {/* New Year's Promo */}
                                            {showNewYearsPromo && (
                                                <View style={styles.promo}>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            const newPromo = promo === "New Year's Promo" ? '' : "New Year's Promo";
                                                            setPromo(newPromo);
                                                            setFieldValue('promo', newPromo);
                                                        }}
                                                    >
                                                        <FontAwesome
                                                            name={values.promo === "New Year's Promo" ? "check-square" : "square-o"}
                                                            size={24}
                                                            color={values.promo === "New Year's Promo" ? "#00FFFF" : "white"}
                                                        />
                                                    </TouchableOpacity>
                                                    <Text style={{ marginLeft: 10, color: 'white' }}>New Year's Promo</Text>
                                                </View>
                                            )}

                                            {/* Summer Promo */}
                                            {showSummerPromo && (
                                                <View style={styles.promo}>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            const newPromo = promo === "Summer Promo" ? '' : "Summer Promo";
                                                            setPromo(newPromo);
                                                            setFieldValue('promo', newPromo);
                                                        }}
                                                    >
                                                        <FontAwesome
                                                            name={values.promo === "Summer Promo" ? "check-square" : "square-o"}
                                                            size={24}
                                                            color={values.promo === "Summer Promo" ? "#00FFFF" : "white"}
                                                        />
                                                    </TouchableOpacity>
                                                    <Text style={{ marginLeft: 10, color: 'white' }}>Summer Promo</Text>
                                                </View>
                                            )}

                                            <View style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                marginBottom: 10,
                                                marginTop: 15
                                            }}>
                                                <TouchableOpacity onPress={() => setFieldValue('agreeTerms', !values.agreeTerms)} >
                                                    <FontAwesome
                                                        name={values.agreeTerms ? "check-square" : "square-o"}
                                                        size={24}
                                                        color={values.agreeTerms ? "#00FFFF" : "white"}
                                                    />
                                                </TouchableOpacity>
                                                <Text style={{ marginLeft: 10, color: 'white', marginTop: 3 }}>Accept Terms and Conditions</Text>
                                            </View>

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
    )
}

export default UserMemberShipPayment