// @ts-ignore Can't find type declaration for module 'react-native-ui-lib/keyboard'
import { KeyboardRegistry } from 'react-native-ui-lib/keyboard';
import {
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
} from 'react-native';
import React from 'react';

export default function CodeKeyboard() {
    const onButtonPress = (key: string) => {
        KeyboardRegistry.onItemSelected('CodeKeyboard', { key });
    };
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

    return (
        <ScrollView
            contentContainerStyle={[
                styles.keyboardContainer,
                { backgroundColor: 'white' },
            ]}
        >
            <Text style={{ color: 'white' }}>HELLOOOO!!!</Text>
            {keys.map((s, i) => (
                <TouchableOpacity
                    key={i}
                    style={{ backgroundColor: 'white' }}
                    onPress={() => onButtonPress(s)}
                >
                    <Text>{s}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    keyboardContainer: {
        position: 'absolute',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',

        bottom: 0,
        left: 0,
        right: 0,
        height: 300,
        zIndex: 0,
    },
});
