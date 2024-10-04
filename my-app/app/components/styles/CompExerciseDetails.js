import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: Constants.statusBarHeight,
        resizeMode:'cover'
    },
    image: {
        width: 192,
        height: 192,
        borderRadius: 10,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    instructions: {
        fontSize: 16,
        marginBottom: 10,
    },
    difficulty: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    starsContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    detailContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    exerciseInfoText:{
        color:'white'
    },
    instructionsText: {
        fontSize: 15,
        color: 'white',
        textAlign: 'center',
    },
    instructionContainer: {
        backgroundColor: 'black',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '90%',
        marginVertical: 10,
    },
    aboutImage: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 400,
    },
});

export default styles;