import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 24,
        textAlign: 'center'
    },
    text: {
        fontSize: 18,
        marginBottom: 16,
    },
    button: {
        height: 50,
        backgroundColor: "#6200ea",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        paddingHorizontal: 20,
        marginTop: 16,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    section: {
        marginVertical: 10,
        marginTop: 20,
    },
    option: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 10,
        backgroundColor: "#fff",
        marginBottom: 10,
        elevation: 2,
    },
    optionText: {
        flex: 1,
        fontSize: 18,
        marginLeft: 10,
        color: "#333",
    },
    optionIcon: {
        marginLeft: "auto",
    },
    profileImageContainer: {
        padding: 20,
        backgroundColor: 'white',
        width: 110,
        height: 110,
        borderRadius: 50,
        alignSelf: 'center',
        position: 'relative',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center',
        position: 'absolute',
        marginTop: 5,
    },
    iconContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: 'white',
        borderRadius: 50,
        padding: 2,
    },
    bottomSheetContainer: {
        backgroundColor: '#36454F',
        paddingVertical: 30,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignItems: 'center',
    },
    qrContainer: {
        alignItems: 'center',
        width: '100%',
    },
    qrTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    qrBox: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
});

export default styles;
