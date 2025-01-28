import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Constants.statusBarHeight,
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
    placeholderText: {
        color: "#888",
        textAlign: "center",
      },
      placeholderBellowText: {
        color: "#888",
        textAlign: "center",
        fontSize: 12,
      },
});

export default styles;