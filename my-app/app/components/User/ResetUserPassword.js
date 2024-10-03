import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, StatusBar, ImageBackground, TouchableOpacity, Image, Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Constants from 'expo-constants'
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation, useRouter } from 'expo-router';
import { resetPassword } from '../../(services)/api/Users/resetPassAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAction } from '../../(redux)/authSlice';


const ResetUserPassword = () => {
    // Yup validation schema
    const validationSchema = Yup.object().shape({
        currentPassword: Yup.string()
            .min(6, 'Password should be at least 6 characters')
            .required('Current password is required'),
        newPassword: Yup.string()
            .min(6, 'Password should be at least 6 characters')
            .required('New password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
            .required('Confirm your new password'),
    });

    const navigation = useNavigation();
    const { user } = useSelector((state) => state.auth);
    const token = user.token
    // console.log(token)

    const router = useRouter();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logoutAction());
        router.push("/auth/login");
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
                    <View style={{ justifyContent: 'center' }}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <AntDesign name="back" size={24} color="white" style={{ marginLeft: 25, fontWeight: 'bold', marginTop: 30, position: 'relative' }} />
                        </TouchableOpacity>
                        <Image source={require('../../../assets/backroundMovable.png')} style={{ alignSelf: 'center', marginRight: 10 }} />
                    </View>
                    <Formik
                        initialValues={{
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: '',
                            token: token,
                        }}
                        validationSchema={validationSchema}
                        onSubmit={async (values) => {
                            try {
                                const response = await resetPassword({
                                    ...values,
                                });

                                Alert.alert(
                                    "Updated Successfully",
                                    "Your Password has been updated. You will be logged out.",
                                    [
                                        {
                                            text: "OK",
                                            onPress: () => {
                                                handleLogout();
                                            },
                                        },
                                    ]
                                );
                            } catch (error) {
                                console.error(error.message);
                                Alert.alert(
                                    "Update Failed",
                                    error.response?.data?.message || "An error occurred during the update. Please try again.",
                                    [{ text: "OK" }]
                                );
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
                        }) => (
                            <View style={styles.formContainer}>
                                <Text style={styles.text}>Current Password</Text>
                                <TextInput
                                    secureTextEntry
                                    style={styles.input}
                                    onChangeText={handleChange('currentPassword')}
                                    onBlur={handleBlur('currentPassword')}
                                    value={values.currentPassword}
                                />
                                {touched.currentPassword && errors.currentPassword && (
                                    <Text style={styles.error}>{errors.currentPassword}</Text>
                                )}

                                <Text style={styles.text}>New Password</Text>
                                <TextInput
                                    secureTextEntry
                                    style={styles.input}
                                    onChangeText={handleChange('newPassword')}
                                    onBlur={handleBlur('newPassword')}
                                    value={values.newPassword}
                                />
                                {touched.newPassword && errors.newPassword && (
                                    <Text style={styles.error}>{errors.newPassword}</Text>
                                )}

                                <Text style={styles.text}>Confirm New Password</Text>
                                <TextInput
                                    secureTextEntry
                                    style={styles.input}
                                    onChangeText={handleChange('confirmPassword')}
                                    onBlur={handleBlur('confirmPassword')}
                                    value={values.confirmPassword}
                                />
                                {touched.confirmPassword && errors.confirmPassword && (
                                    <Text style={styles.error}>{errors.confirmPassword}</Text>
                                )}

                                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                                    <Text style={styles.buttonText}>Reset Password</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </Formik>
                </ImageBackground>
            </View>
        </>
    );
};

export default ResetUserPassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
    },
    backgroundImage: {
        flex: 1,
    },
    formContainer: {
        justifyContent: 'center'
    },
    text: {
        color: 'white',
        textAlign: 'center'
    },
    input: {
        width: '75%',
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: 'white',
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
        backgroundColor: 'white'
    },
    button: {
        height: 50,
        width: '50%',
        backgroundColor: "#FFAC1C",
        alignSelf: "center",
        borderRadius: 8,
        marginTop: 15,
    },
    buttonText: {
        color: "black",
        alignSelf: "center",
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 15,
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
});
