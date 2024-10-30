import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, StatusBar, ImageBackground, TouchableOpacity, Image, Alert, TextInput } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Constants from 'expo-constants'
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from 'expo-router';
import { getAllBranch } from '../../(services)/api/Branches/getAllBranch';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from '../styles/CompUserMemberPaymentStyle';
import { MembershipPayment } from '../../(services)/api/Users/paymentTesting';

//Validation Schema
const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email("Invalid email")
        .required("Email is Required"),
    birthDate: Yup.date().required("Birth date is required"),
});

const UserMemberShipPayment = () => {
    const navigation = useNavigation();
    const scrollViewRef = useRef(null);

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

    // console.log(date)


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
                                    initialValues={{ userBranch: "", birthDate: date }}
                                    onSubmit={async (values) => {
                                        // setIsLoading(true);
                                        console.log("Formik Values", userBranch)
                                        try {
                                            const response = await MembershipPayment({
                                                ...values,
                                            });
                                        } catch (error) {
                                            console.error('Formik clickable failed:', error.response?.data?.message || error.message);
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
                                                        console.log("Selected Branch ID:", itemValue);
                                                        handleChange("userBranch")(itemValue);
                                                        handleBlur("userBranch");
                                                    }}
                                                >
                                                    <Picker.Item label="Select a Branch" value="" />
                                                    {branches.map((branch) => (
                                                        <Picker.Item key={branch._id} label={branch.name} value={branch._id} />
                                                    ))}
                                                </Picker>
                                                {errors.userBranch && touched.userBranch && (
                                                    <Text style={styles.errorText}>{errors.userBranch}</Text>
                                                )}
                                            </View>

                                            <TouchableOpacity onPress={() => setShow(true)} style={{
                                                backgroundColor: '#fff',
                                                padding: 10,
                                                borderRadius: 5,
                                                alignItems: 'center',
                                            }}>
                                                <Text style={{
                                                    fontSize: 16,
                                                    color: '#000',
                                                    marginTop: 20,
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
                                                            console.log("Selected Date:", selectedDate);
                                                            setShow(false);
                                                            setFieldValue("birthDate", selectedDate);
                                                        } else {
                                                            setShow(false);
                                                        }
                                                    }}
                                                />
                                            )}
                                            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                                                <Text style={styles.buttonText}>TestSend</Text>
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