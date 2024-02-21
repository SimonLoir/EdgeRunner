import { Slot } from 'expo-router';
import { Platform, SafeAreaView, StatusBar, StyleSheet } from 'react-native';

// Import your global CSS file
import '../global.css';

export default function Layout() {
    return (
        <SafeAreaView
            style={safeAreaStyle.AndroidSafeArea}
            className='bg-[rgb(24,24,24)]'
        >
            <Slot />
        </SafeAreaView>
    );
}

const safeAreaStyle = StyleSheet.create({
    AndroidSafeArea: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
});
