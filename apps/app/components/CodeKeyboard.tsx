// @ts-ignore Can't find type declaration for module 'react-native-ui-lib/keyboard'
import { KeyboardRegistry } from 'react-native-ui-lib/keyboard';
import {
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    FlatList,
    View,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import KeyboardEventManager from 'utils/keyboardEventManager';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';

export const keys: Map<string, string | JSX.Element> = new Map([
    ['1', '1'],
    ['2', '2'],
    ['3', '3'],
    ['4', '4'],
    ['5', '5'],
    ['6', '6'],
    ['7', '7'],
    ['8', '8'],
    ['9', '9'],
    ['0', '0'],
    ['A', 'A'],
    ['Z', 'Z'],
    ['E', 'E'],
    ['R', 'R'],
    ['T', 'T'],
    ['Y', 'Y'],
    ['U', 'U'],
    ['I', 'I'],
    ['O', 'O'],
    ['P', 'P'],
    ['Q', 'Q'],
    ['S', 'S'],
    ['D', 'D'],
    ['F', 'F'],
    ['G', 'G'],
    ['H', 'H'],
    ['J', 'J'],
    ['K', 'K'],
    ['L', 'L'],
    ['M', 'M'],
    ['W', 'W'],
    ['X', 'X'],
    ['C', 'C'],
    ['V', 'V'],
    ['B', 'B'],
    ['N', 'N'],
    ['Backspace', <Ionicons name='backspace' size={30} color='white' />],
]);

keys.set('\n', <AntDesign name='enter' size={30} color='white' />);

type CodeKeyboardProps = {
    onDismiss: () => void;
    isVisble: boolean;
    onOpen: () => void;
};
export default function CodeKeyboard({
    onDismiss,
    isVisble,
    onOpen,
}: CodeKeyboardProps) {
    const maxRows = 5;
    const nbrows = keys.size < maxRows ? keys.size : maxRows;
    const nbColumns = 10;
    const startValue = 30;
    const endValue = 300;
    const viewPosition = useSharedValue(endValue);

    useEffect(() => {
        if (isVisble) {
            viewPosition.value = withTiming(endValue);
        } else {
            viewPosition.value = withTiming(startValue);
        }
    }, [isVisble]);

    return (
        <>
            <Animated.View
                style={{
                    height: viewPosition,
                }}
            >
                <View
                    className='bg-[rgb(50,50,50)]'
                    style={[styles.keyboardContainer]}
                >
                    {isVisble ? (
                        <TouchableOpacity onPress={onDismiss}>
                            <AntDesign name='down' size={30} color='white' />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={onOpen}>
                            <AntDesign name='up' size={30} color='white' />
                        </TouchableOpacity>
                    )}

                    <Text>
                        {Array.from(keys.keys()).map((key) => (
                            <TouchableOpacity
                                key={key}
                                className='bg-[rgb(30,30,30)]'
                                style={{
                                    width:
                                        Dimensions.get('window').width /
                                        nbColumns,
                                    height: 40,
                                    margin: 5,
                                    borderRadius: 10,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                onPress={() => {
                                    KeyboardEventManager.emitKeyDown(key);
                                }}
                            >
                                <Text className='text-white'>
                                    {keys.get(key)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </Text>
                </View>
            </Animated.View>
        </>
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
