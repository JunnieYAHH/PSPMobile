import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

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
        marginTop: 20,
        justifyContent: "space-around",
        alignItems: "center",
        padding: 16,
    },
    input: {
        height: 50,
        width: "100%",
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 16,
        color: 'black',
        backgroundColor: "#fff",
    },
    text: {
        textAlign: "left",
        width: "100%",
        marginBottom: 5,
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    button: {
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        marginTop: 16,
        width: '100%',
    },
    buttonText: {
        color: "black",
        fontSize: 18,
        fontWeight: "bold",
    },
})

export default styles;
