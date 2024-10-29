import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
    },
    backgroundImage: {
        flex: 1,
    },
    safeAreaView: {
        flex: 1,
    },
    headerContainer: {
        marginHorizontal: 16,
        marginTop: 30,
        // backgroundColor: 'white',
        borderRadius: 30,
        height: 500
    },
    headerText: {
        fontSize: 12,
        fontWeight: '100',
        color: 'white',
        marginLeft: 2,
        padding: 10,
        marginTop: 8,
    },
    form: {
        width: "100%",
        borderRadius: 10,
        padding: 20,
    },
    pickerContainer: {
        borderRadius: 10, // Add border radius here
        overflow: 'hidden', // Ensures the rounded corners are applied
        borderColor: '#ccc',
    },
    picker: {
        height: 30,
        width: "70%",
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 16,
        marginBottom: 16,
        backgroundColor: "#fff",
    },
    text: {
        color: 'white',
        marginBottom: 5
    },
    errorText: {
        color: "red",
        marginBottom: 16,
    },
    button: {
        height: 50,
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

export default styles;