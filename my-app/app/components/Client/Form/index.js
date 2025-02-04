import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ImageBackground, StatusBar, Alert, Image } from 'react-native';
import { Formik } from 'formik';
import { useRouter } from 'expo-router';
import * as Yup from 'yup';
import { FontAwesome } from "@expo/vector-icons";
import Constants from 'expo-constants';
import LoadingScreen from '../../LodingScreen';
import { submitParQ } from '../../../(services)/api/Client/submitParQ';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserAction } from '../../../(redux)/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const QuestionnaireForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    useEffect(() => {
        // console.log("Updated User in Redux Store:", updatedUser);
    }, [user]);
    return isLoading ? (
        <LoadingScreen />
    ) : (
        <>
            <StatusBar translucent backgroundColor="transparent" />
            <View style={styles.container}>
                <ImageBackground
                    source={require('../../../../assets/ProgramBG.png')}
                    style={styles.backgroundImage}
                    imageStyle={{ opacity: 1.5 }}
                    blurRadius={2}
                >
                    <View style={{ justifyContent: 'center' }}>
                        <Image source={require('../../../../assets/backroundMovable.png')} style={{ alignSelf: 'center', marginRight: 10, width: '30%', height: '20%' }} />
                    </View>
                    <Formik
                        initialValues={{
                            q1: null,
                            q2: null,
                            q3: null,
                            q4: null,
                            q5: null,
                            q6: null,
                            q7: null,
                        }}
                        onSubmit={async (values) => {
                            // Check if all questions are answered
                            const unanswered = Object.values(values).some(value => value === null);
                            setIsLoading(true);
                            try {
                                const response = await submitParQ({
                                    ...values,
                                    userId: user?.user?._id

                                });
                                if (response && response.user) {
                                    dispatch(updateUserAction(response.user)); 
                                    await AsyncStorage.setItem("userInfo", JSON.stringify(response.user));
                                }
                                Alert.alert(
                                    "Submission Successful",
                                    "Thank you for completing the questionnaire.",
                                    [
                                        {
                                            text: "OK",
                                            onPress: () => {
                                                setIsLoading(false);
                                                router.push('/components/Client/(tabs)');
                                            },
                                        },
                                    ]
                                );
                                setIsLoading(false);
                                // router.push('/nextScreen');
                            } catch (error) {
                                console.error('Submission failed:', error.message);
                                setIsLoading(false);
                                Alert.alert("Submission Failed", "An error occurred. Please try again.");
                            }
                        }}
                    >
                        {({ handleSubmit, setFieldValue, values }) => (
                            <View style={styles.form}>
                                <Text style={styles.text}>
                                    Physical Activity Readiness Questionnaire "Par-Q"
                                </Text>
                                {questions.map((question, index) => (
                                    <View key={index} style={styles.questionContainer}>
                                        <Text style={styles.questionText}>{question}</Text>
                                        <View style={styles.optionsContainer}>
                                            <TouchableOpacity
                                                style={styles.option}
                                                onPress={() => setFieldValue(`q${index + 1}`, true)}
                                            >
                                                <FontAwesome
                                                    name={values[`q${index + 1}`] === true ? "check-circle" : "circle-o"}
                                                    size={16}
                                                    color="#6200ea"
                                                />
                                                <Text style={styles.optionText}>Yes</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.option}
                                                onPress={() => setFieldValue(`q${index + 1}`, false)}
                                            >
                                                <FontAwesome
                                                    name={values[`q${index + 1}`] === false ? "check-circle" : "circle-o"}
                                                    size={16}
                                                    color="#6200ea"
                                                />
                                                <Text style={styles.optionText}>No</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))}

                                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                                    <Text style={styles.buttonText}>Submit</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </Formik>
                    <Text style={styles.reminderText}>
                        If you have answered "Yes" to one or more of the above questions, consult your physician before engaging in physical activity.
                        tell your physician which questions you answered "Yes" to. After medical evaluation, seek advice from your physician on what type of activity
                        is suitable for your current condition.
                    </Text>
                </ImageBackground>
            </View>
        </>
    );
};

export default QuestionnaireForm;

const questions = [
    "Has your doctor eversaid that you have a heart condition and that you should only perform physical activity recommended by a doctor",
    "Do you feel pain in your chest when you perform physical activity?",
    "In the past month, have you had chest pain when you were not performing any physical activity?",
    "Do you lose your balance because of dizziness or do you ever lose consciousness?",
    "Do you have a bone or joint problem that could be made worse by a change in your physical activity?",
    "Is your doctor currently prescribing any medication for your blood pressure or for a heart condition?",
    "Do you know of any other reason why you should not engage in physical activity?",
];

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    form: {
        padding: 20,
        borderRadius: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    text: {
        color: "black",
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 20,
        fontSize: 12,
    },
    reminderText: {
        color: "black",
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 20,
        fontSize: 13,
    },
    questionContainer: {
        marginBottom: 10,
    },
    questionText: {
        fontSize: 12,
        color: '#333',
        marginBottom: 8,
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionText: {
        fontSize: 14,
        marginLeft: 8,
        color: '#333',
    },
    button: {
        height: 30,
        backgroundColor: "#6200ea",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        marginTop: 16,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
});
