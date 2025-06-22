import React, { useEffect, useRef, useState } from "react";
import {
    View,
    StyleSheet,
    TextInput,
    Text,
    TouchableOpacity,
    StatusBar,
    ImageBackground,
    Alert,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../(services)/api/Users/loginUserAPI";
import { useDispatch, useSelector } from "react-redux";
import { loginAction } from "../(redux)/authSlice";
import { FontAwesome } from "@expo/vector-icons";
import Constants from 'expo-constants';
import LoadingScreen from "../components/LodingScreen";
import LottieView from 'lottie-react-native';
import { registerForPushNotificationsAsync } from "../../hooks/usePushNotifications";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(6, "Too Short!").required("Required"),
});


const Login = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const animation = useRef(null)

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const mutation = useMutation({
        mutationFn: loginUser,
        mutationKey: ["login"],
    });
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        if (!user) return;

        const role = user.user?.role || user.role;
        const par_Q = user.user?.par_Q || [];

        switch (role) {
            case "user":
                router.push("/(tabs)");
                break;
            case "client":
                if (par_Q.length === 0) {
                    router.replace("/components/Client/Form");
                } else {
                    router.replace("/components/Client/(tabs)");
                }
                break;
            case "coach":
                router.replace("/components/Coach/(tabs)");
                break;
            case "admin":
                router.replace("/components/Admin/(tabs)");
                break;
            default:
                break;
        }
    }, [user, router]);

    return (
        <>
            {isLoading ? (
                <LoadingScreen />
            ) : (
                <>
                    <StatusBar translucent backgroundColor="transparent" />
                    <ImageBackground
                        source={require('../../assets/ProgramBG.png')}
                        style={styles.backgroundImage}
                        imageStyle={{ opacity: 2.0 }}
                        blurRadius={2}
                        resizeMode="cover"
                    >
                        <View style={styles.container}>
                            <LottieView
                                ref={animation}
                                source={require('../../assets/LandingScreen.json')}
                                autoPlay
                                loop
                                style={{ width: 400, height: 300, marginTop: 80, position: 'absolute' }}
                            />
                            <View style={styles.overlay}>
                                <Text style={styles.title}>Login</Text>
                                <Formik
                                    initialValues={{ email: "", password: "" }}
                                    validationSchema={LoginSchema}
                                    onSubmit={(values) => {
                                        setIsLoading(true);
                                        mutation.mutateAsync(values)
                                            .then(async (data) => {
                                                dispatch(loginAction(data));
                                                const token = await registerForPushNotificationsAsync(data.user._id);

                                                if (token && data?.user?._id) {
                                                    await setDoc(doc(db, 'users', data.user._id), {
                                                        expoPushToken: token
                                                    }, { merge: true });
                                                }
                                            })
                                            .catch((error) => {
                                                setIsLoading(false);
                                                console.log(error.message)
                                                Alert.alert(
                                                    "Login Failed", "Your Email or Password is Incorrent. Try Again",
                                                    [{ text: "OK" }]
                                                );
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
                                            <View style={styles.passwordContainer}>
                                                <TextInput
                                                    style={styles.passwordInput}
                                                    placeholder="Password"
                                                    onChangeText={handleChange("password")}
                                                    onBlur={handleBlur("password")}
                                                    value={values.password}
                                                    secureTextEntry={!showPassword}
                                                />
                                                <TouchableOpacity
                                                    onPress={() => setShowPassword(!showPassword)}
                                                >
                                                    <FontAwesome
                                                        name={showPassword ? "eye-slash" : "eye"}
                                                        size={19}
                                                        color="grey"
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                            {errors.password && touched.password ? (
                                                <Text style={styles.errorText}>{errors.password}</Text>
                                            ) : null}
                                            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                                                <Text style={styles.buttonText}>Login</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ alignSelf: 'flex-end', fontWeight: 'bold', marginTop: 20 }} onPress={() => router.push('/auth/register')}>
                                                <Text style={styles.buttonText}>Register</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </Formik>
                            </View>
                        </View>
                    </ImageBackground>
                </>
            )}
        </>
    );
};

export default Login;

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
        marginTop: 150
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
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF",
        borderRadius: 5,
        marginVertical: 10,
        paddingRight: 10,
    },
    passwordInput: {
        flex: 1,
        padding: 10,
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