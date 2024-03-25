// @ts-ignore Can't find type declaration for module 'react-native-ui-lib/keyboard'
import {
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import KeyboardEventManager from 'utils/keyboardEventManager';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import GestureKey from './GestureKey';

export const keys = new Map<string, string | JSX.Element>([
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
    const nbColumns = keys.size < 10 ? keys.size : 10;
    const startValue = 30;
    const [endValue, setEndValue] = useState(300);
    const viewPosition = useSharedValue(endValue);
    const { height, width } = useWindowDimensions();

    useEffect(() => {
        if (isVisble) {
            viewPosition.value = withTiming(endValue);
        } else {
            viewPosition.value = withTiming(startValue);
        }
    }, [isVisble]);

    const generateKeyboard = (keys: Map<string, string | JSX.Element>) => {
        const keyboard = [];
        let row = [];
        let i = 0;
        for (const [key, value] of keys.entries()) {
            row.push(
                <TouchableOpacity
                    key={key}
                    className='bg-[rgb(30,30,30)]'
                    style={{
                        width: width / (nbColumns + 2),
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
                    <Text className='text-white'>{value}</Text>
                </TouchableOpacity>
            );
            i++;
            if (i === nbColumns) {
                keyboard.push(row);
                row = [];
                i = 0;
            }
        }
        if (row.length > 0) {
            keyboard.push(row);
        }
        return keyboard;
    };

    const tap = Gesture.Tap()
        .minPointers(1)
        .onStart(() => {
            console.log('tap');
        })
        .onBegin(() => {
            console.log('begin');
        });

    return (
        <>
            <Animated.View
                className='bg-[rgb(50,50,50)]'
                style={{
                    height: viewPosition,
                }}
            >
                <View
                    className='bg-[rgb(50,50,50)] items-center bottom-0 mb-0'
                    onLayout={(event) =>
                        setEndValue(event.nativeEvent.layout.height)
                    }
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

                    <GestureKey
                        keys={
                            new Map<string, string | JSX.Element>([
                                ['1', '1'],
                                ['2', '2'],
                                ['3', '3'],
                                ['4', '4'],
                                ['5', '5'],
                                ['6', '6'],
                                ['7', '7'],
                                ['8', '8'],
                                ['9', '9'],
                            ])
                        }
                    />

                    {generateKeyboard(keys).map((row, index) => {
                        return (
                            <View key={index} className='flex-row'>
                                {row}
                            </View>
                        );
                    })}
                </View>
            </Animated.View>
        </>
    );
}
