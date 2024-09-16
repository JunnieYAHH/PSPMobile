const { Tabs } = require('expo-router')
import { FontAwesome } from '@expo/vector-icons'
import AntDesign from '@expo/vector-icons/AntDesign';

export default function RootLayout() {
    return (
        <Tabs>
            <Tabs.Screen name="index" options={{
                headerShown: false, title: 'Home', tabBarIcon: ({ color }) => (
                    <FontAwesome name='home' color={color} size={28} />
                )
            }} />
            <Tabs.Screen name="profile" options={{
                headerShown: false, title: 'Profile', tabBarIcon: ({ color }) => (
                    <FontAwesome name='user' color={color} size={28} />
                )
            }} />
            <Tabs.Screen name="settings" options={{
                headerShown: false, title: 'Settings', tabBarIcon: ({ color }) => (
                    <FontAwesome name='cog' color={color} size={28} />
                )
            }} />
        </Tabs >
    );
}