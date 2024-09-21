import { StyleSheet, Text, View, TouchableOpacity, StatusBar } from 'react-native';
import React from 'react';
import { Video, ResizeMode } from 'expo-av';
import { useRouter } from "expo-router";
import Constants from 'expo-constants';

const Home = () => {
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});
    const router = useRouter();

    return (
        <>
            <StatusBar translucent backgroundColor="transparent" />
            <View style={styles.container}>
                <View style={styles.videoContainer}>
                    <Video
                        ref={video}
                        style={styles.video}
                        source={require('../assets/PSPBackgroundVideo.mp4')}
                        resizeMode={ResizeMode.COVER}
                        shouldPlay
                        isLooping
                        isMuted
                        onError={(error) => console.error("Video error:", error)}
                        onPlaybackStatusUpdate={(status) => setStatus(() => status)}
                    />
                </View>
                <View style={styles.buttons}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => router.push("/auth/login")}
                    >
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => router.push("/auth/register")}
                    >
                        <Text style={styles.buttonText}>Register</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
    },
    videoContainer: {
        flex: 1,
        overflow: 'hidden',
    },
    video: {
        ...StyleSheet.absoluteFillObject,
    },
    buttons: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        position: "absolute",
        bottom: 30,
        left: 0,
        right: 0,
        padding: 10,
        borderRadius: 10,
    },
    button: {
        paddingVertical: 40,
        paddingHorizontal: 40,
        borderRadius: 25,
        elevation: 3,
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
});
