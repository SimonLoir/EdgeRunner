// @ts-ignore Can't find type declaration for module 'react-native-ui-lib/keyboard'
import { KeyboardRegistry } from 'react-native-ui-lib/keyboard';
import {
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    FlatList,
    View,
} from 'react-native';
import React from 'react';
import KeyboardEventManager from 'utils/keyboardEventManager';
export const keys: string[] = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '0',
];
export default function CodeKeyboard() {
    const maxRows = 5;
    const nbrows = keys.length < maxRows ? keys.length : maxRows;
    const nbColumns = Math.ceil(keys.length / nbrows);

    return (
        <View className='bg-[rgb(50,50,50)]' style={[styles.keyboardContainer]}>
            <FlatList
                numColumns={nbColumns}
                data={keys}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        className='bg-[rgb(30,30,30)]'
                        style={{
                            width: '50%',
                            height: 50,
                            margin: 5,
                            borderRadius: 10,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        onPress={() => {
                            KeyboardEventManager.emitKeyDown(item);
                        }}
                    >
                        <Text className='text-white'>{item}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    keyboardContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        bottom: 0,
        height: 300,
        marginBottom: 0,
    },
});
