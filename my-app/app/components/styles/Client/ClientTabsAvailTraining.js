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
    pickerContainer: {
        borderRadius: 10,
        overflow: 'hidden',
        borderColor: '#ccc',
        backgroundColor: '#f9f1f1',
        height: 45,
        width: 150,
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    picker: {
        height: 40,
        width: 150,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 16,
        backgroundColor: "#fff",
        alignSelf: 'flex-start',
        borderRadius: 20,
    },
    pickerItem: {
        fontSize: 12,
        borderRadius: 20,
    },
    modalBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
        width: "90%",
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    signatureWrapper: {
        width: "100%",
        height: 300,
        borderWidth: 2,
        borderColor: "#000",
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    modalButton: {
        backgroundColor: "#007BFF",
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    closeButton: {
        backgroundColor: "#FF0000",
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    modalButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    signatureImage: {
        width: 200,
        height: 100,
        marginTop: 20,
        borderWidth: 1,
        borderColor: "#000",
    },
})

export default styles;
