import { Stack } from 'expo-router';
import { Platform, StatusBar, StyleSheet } from 'react-native';

// Import your global CSS file
import '../global.css';

export default function Layout() {
    return (
        <Stack
            screenOptions={{
                contentStyle: {
                    ...safeAreaStyle.AndroidSafeArea,
                    backgroundColor: 'rgb(30 41 59)',
                    padding: 20,
                },
                headerStyle: {
                    backgroundColor: 'rgb(15 23 42)',
                },
                headerTitleStyle: {
                    color: 'white',
                },
                headerTintColor: 'white',

                statusBarTranslucent: true,
                statusBarStyle: 'light',
            }}
        >
            <Stack.Screen
                name='index'
                options={{
                    title: 'Home',
                }}
            />

            <Stack.Screen
                name='projects'
                options={{
                    presentation: 'modal',
                    title: 'Projects',
                }}
            />
        </Stack>
    );
}

const safeAreaStyle = StyleSheet.create({
    AndroidSafeArea: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
});
