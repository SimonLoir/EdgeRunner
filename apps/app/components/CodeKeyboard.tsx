// @ts-ignore Can't find type declaration for module 'react-native-ui-lib/keyboard'
import { KeyboardAccessoryView } from 'react-native-ui-lib/keyboard';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';

export default function CodeKeyboard() {
    const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const renderKeyboardContent = () => {
        return (
            <View style={styles.container}>
                {keys.map((s, i) => (
                    <TouchableOpacity key={i} style={styles.button}>
                        <Text>{s}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };
    return (
        <KeyboardAccessoryView
            renderContent={renderKeyboardContent}
            scrollBehavior={
                KeyboardAccessoryView.scrollBehaviors
                    .SCROLL_TO_BOTTOM_INVERTED_ONLY
            }
        />
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: '#EDEDED',
        paddingVertical: 5,
        marginBottom: '30%',
        justifyContent: 'center',
    },
    button: {
        width: '10%',
        height: 50,
        margin: 5,
        borderRadius: 10,
        backgroundColor: '#F7F7F7',
        justifyContent: 'center',
        alignItems: 'center',
    },
    toggleButton: {
        width: '10%',
        height: 50,
        margin: 5,
        borderRadius: 10,
        backgroundColor: '#F7F7F7',
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputAccessoryView: {
        backgroundColor: '#2A2A2A',
        height: 48,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: 0.8,
        borderColor: '#c4c4c4',
    },
    inputAccessoryButton: {
        backgroundColor: 'gray',
        height: 35,
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
        borderRadius: 5,
    },
});
