import React, { useEffect } from "react";
import {
    View,
    StyleSheet,
    TextInput,
    Text,
    TouchableOpacity,
    StatusBar,
    ImageBackground,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../(services)/api/loginUserAPI";
import { useDispatch, useSelector } from "react-redux";
import { loginAction } from "../(redux)/authSlice";
import Constants from 'expo-constants';

const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(6, "Too Short!").required("Required"),
});

export default function Login() {
    const router = useRouter();
    const dispatch = useDispatch();
    const mutation = useMutation({
        mutationFn: loginUser,
        mutationKey: ["login"],
    });
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        if (user) {
            router.push("/(tabs)"); 
        }
    }, [user, router]);

    return (
        <>
            <StatusBar translucent backgroundColor="transparent" />
            <View style={styles.container}>
                <ImageBackground
                    source={require('../../assets/loginBG.png')}
                    style={styles.backgroundImage}
                    imageStyle={{ opacity: 1.5 }}
                    resizeMode="stretch" 
                >
                    <View style={styles.overlay}>
                        <Text style={styles.title}>Login</Text>
                        <Formik
                            initialValues={{ email: "", password: "" }}
                            validationSchema={LoginSchema}
                            onSubmit={(values) => {
                                mutation.mutateAsync(values)
                                    .then((data) => {
                                        dispatch(loginAction(data));
                                    })
                                    .catch((err) => {
                                        console.log(err);
                                    });
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
                                <View style={styles.form}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Email"
                                        onChangeText={handleChange("email")}
                                        onBlur={handleBlur("email")}
                                        value={values.email}
                                        keyboardType="email-address"
                                    />
                                    {errors.email && touched.email ? (
                                        <Text style={styles.errorText}>{errors.email}</Text>
                                    ) : null}
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Password"
                                        onChangeText={handleChange("password")}
                                        onBlur={handleBlur("password")}
                                        value={values.password}
                                        secureTextEntry
                                    />
                                    {errors.password && touched.password ? (
                                        <Text style={styles.errorText}>{errors.password}</Text>
                                    ) : null}
                                    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                                        <Text style={styles.buttonText}>Login</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </Formik>
                    </View>
                </ImageBackground>
            </View>
        </>
    );
}

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
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 24,
        color: '#FFAC1C'
    },
    form: {
        width: "100%",
    },
    input: {
        height: 50,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 16,
        backgroundColor: "#fff",
    },
    errorText: {
        color: "red",
        marginBottom: 16,
    },
    button: {
        height: 50,
        backgroundColor: "#FFAC1C",
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
