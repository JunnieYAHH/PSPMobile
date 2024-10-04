import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        width: 224,
        height: 450,
        borderRadius: 15,
        padding: 10,
        margin: 10,
        justifyContent: 'flex-start',
    },
    content: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 5,
    },
    text: {
        color: 'white',
        marginTop: 10,
        textAlign: 'center',
    },
    animatableView: {
        width: 224,
        height: 280,
        marginRight: 24,
        borderRadius: 24,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#6200ea',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default styles;