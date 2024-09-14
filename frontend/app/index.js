import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { Video, ResizeMode } from 'expo-av';
import { useRouter } from "expo-router";

const Home = () => {
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});
    const router = useRouter();

    return (
        <View style={styles.container}>
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
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },
    video: {
        ...StyleSheet.absoluteFillObject,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    mainText: {
        color: "white",
        fontSize: 68,
        fontWeight: "bold",
        textAlign: "center",
    },
    subText: {
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
    },
    tagline: {
        color: "white",
        fontSize: 18,
        fontStyle: "italic",
        textAlign: "center",
        marginTop: 10,
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
        elevation: 3, // Adds a shadow effect on Android
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
});