import { ImageBackground, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Constants from 'expo-constants';

const Training = () => {
    return (
        <>
            <StatusBar translucent backgroundColor="transparent" />
            <ImageBackground
                source={require('../../../../assets/ProgramBG.png')}
                style={styles.backgroundImage}
                imageStyle={{ opacity: 2.0 }}
                blurRadius={2}
                resizeMode="cover"
            >
                <View style={styles.overlay}>
                    <View style={{ flexDirection: 'row' }}>
                        <View><Text style={{color:'white'}}>Hello1</Text></View>
                        <View><Text style={{color:'white'}}>Hello2</Text></View>
                    </View>
                </View>
            </ImageBackground>
        </>
    )
}

export default Training

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
})