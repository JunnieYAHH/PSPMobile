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
    card: {
        width: 400,
        height: 250,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    textCard: {
        flex: 1,
        padding: 10,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        marginLeft: 15,
    },
    imageContainer: {
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    arnoldImage: {
        width: '100%',
        height: 100,
        borderRadius: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        marginTop: 20,
        marginLeft: 15,
        justifyContent: 'center',
    },
    button: {
        backgroundColor: 'gray',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginRight: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    filterContainer: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginTop: 20,
    },
    filterBackground: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    checkbox: {
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 5,
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'gray',
    },
    checkboxSelected: {
        backgroundColor: '#FFAC1C',
    },
    checkboxText: {
        fontSize: 16,
        color: 'black',
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    exerciseCard: {
        padding: 15,
        backgroundColor: 'white',
        margin: 5,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    exerciseImage: {
        width: '100%',
        height: 150,
        borderRadius: 10,
    },
    exerciseInfoContainer: {
        marginTop: 10,
    },
    exerciseName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    exerciseDetails: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 10,
    },
    instructionsContainer: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#FFAC1C',
        borderRadius: 8,
    },
    instructionsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 5,
    },
    exerciseInstructions: {
        fontSize: 14,
        color: 'white',
    },
    bmiContainer: {
        marginTop: 20,
        padding: 20,
        backgroundColor: '#FFAC1C',
        borderRadius: 10,
        alignItems: 'center',
    },
    input: {
        height: 40,
        borderColor: 'white',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        color: 'white',
        width: '80%',
        marginBottom: 15,
    },
    calculateButton: {
        backgroundColor: 'white',
        borderRadius: 10,
        width: '42%',
    },
});

export default styles;