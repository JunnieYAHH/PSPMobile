import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Image } from 'react-native';
import React, { useRef } from 'react';
import { Video, ResizeMode } from 'expo-av';
import { useRouter } from "expo-router";
import Constants from 'expo-constants';
import LottieView from 'lottie-react-native';

const Home = () => {
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});
    const router = useRouter();
    const animation = useRef(null)

    return (
        <>
            <StatusBar translucent backgroundColor="transparent" />
            <View style={styles.container}>
                <Image source={require('../assets/backroundMovable.png')} style={{ alignSelf: 'center', width: 390, height: 325, borderBottomRightRadius: 40, borderBottomLeftRadius: 40 }} />
                <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                    <LottieView
                        ref={animation}
                        source={require('../assets/LandingPage.json')}
                        autoPlay
                        loop
                        style={{ width: 400, height: 600, marginTop: 80,  marginBottom: 300 }}
                    />
                </View>
                <TouchableOpacity
                    style={styles.buttons}
                    onPress={() => router.push("/auth/login")}
                >
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Proceed</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#353839',
    },
    videoContainer: {
        flex: 1,
        overflow: 'hidden',
    },
    video: {
        ...StyleSheet.absoluteFillObject,
    },
    buttons: {
        backgroundColor: '#FFA500',
        alignItems: "center",
        position: "absolute",
        bottom: 180,
        left: 0,
        right: 0,
        borderRadius: 10,
        marginLeft: 15,
        width: 300,
        marginLeft: 50,
        height: 50,
        padding: 15,
        borderRadius: 25,
    },
    button: {
        borderRadius: 25,
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
});
