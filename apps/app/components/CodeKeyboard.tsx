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
import { z } from 'zod';
import { completionItemSchema } from '@/schemas/exportedSchemas';

export const preKeys = new Map<number, string>([
    [1, 'Text'],
    [2, 'Method'],
    [3, 'Function'],
    [4, 'Constructor'],
    [5, 'Field'],
    [6, 'Variable'],
    [7, 'Class'],
    [8, 'Interface'],
    [9, 'Module'],
    [10, 'Property'],
    [11, 'Unit'],
    [12, 'Value'],
    [13, 'Enum'],
    [14, 'Keyword'],
    [15, 'Snippet'],
    [16, 'Color'],
    [17, 'File'],
    [18, 'Reference'],
    [19, 'Folder'],
    [20, 'EnumMember'],
    [21, 'Constant'],
    [22, 'Struct'],
    [23, 'Event'],
    [24, 'Operator'],
    [25, 'TypeParameter'],
]);

const numKeys = new Map<string, string | JSX.Element>([
    ['0', '0'],
    ['1', '1'],
    ['2', '2'],
    ['3', '3'],
    ['4', '4'],
    ['5', '5'],
    ['6', '6'],
    ['7', '7'],
    ['8', '8'],
    ['9', '9'],
]);
export const upperLettersKeys = new Map<string, string | JSX.Element>([
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
]);

export const lowerLettersKeys = new Map<string, string | JSX.Element>([
    ['a', 'a'],
    ['z', 'z'],
    ['e', 'e'],
    ['r', 'r'],
    ['t', 't'],
    ['y', 'y'],
    ['u', 'u'],
    ['i', 'i'],
    ['o', 'o'],
    ['p', 'p'],
    ['q', 'q'],
    ['s', 's'],
    ['d', 'd'],
    ['f', 'f'],
    ['g', 'g'],
    ['h', 'h'],
    ['j', 'j'],
    ['k', 'k'],
    ['l', 'l'],
    ['m', 'm'],
    ['w', 'w'],
    ['x', 'x'],
    ['c', 'c'],
    ['v', 'v'],
    ['b', 'b'],
    ['n', 'n'],
]);

export const baseKeys = new Map<string, string | JSX.Element>([
    ['Backspace', <Ionicons name='backspace' size={30} color='white' />],
    ['\n', <AntDesign name='enter' size={30} color='white' />],
]);

type CodeKeyboardProps = {
    onDismiss: () => void;
    isVisble: boolean;
    onOpen: () => void;
    keyBoardItems: z.infer<typeof completionItemSchema>[];
};

export default function CodeKeyboard({
    onDismiss,
    isVisble,
    onOpen,
    keyBoardItems,
}: CodeKeyboardProps) {
    const nbColumns = 10;
    const startValue = 30;
    const [endValue, setEndValue] = useState(300);
    const viewPosition = useSharedValue(endValue);
    const { height, width } = useWindowDimensions();
    const keyHeight = 40;
    const keyMargin = 5;

    useEffect(() => {
        if (isVisble) {
            viewPosition.value = withTiming(endValue);
        } else {
            viewPosition.value = withTiming(startValue);
        }
    }, [isVisble]);

    const generateKeyboard = (
        keys: Map<string, string | JSX.Element>,
        onPress: (key: string) => void
    ) => {
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
                        height: keyHeight,
                        margin: keyMargin,
                        borderRadius: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onPress={() => {
                        onPress(key);
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

                    {keyBoardItems.length > 0 ? (
                        generateKeyboard(
                            new Map(
                                keyBoardItems
                                    .slice(
                                        0,
                                        keyBoardItems.length > 10
                                            ? 10
                                            : keyBoardItems.length
                                    )
                                    .map((item) => [item.label, item.label])
                            ),
                            (key: string) =>
                                KeyboardEventManager.emitCompletionItemDown(key)
                        ).map((row, index) => {
                            return (
                                <View key={index} className='flex-row'>
                                    {row}
                                </View>
                            );
                        })
                    ) : (
                        <View
                            style={{ height: keyHeight + 2 * keyMargin }}
                        ></View>
                    )}
                    {generateKeyboard(
                        new Map(
                            [...numKeys]
                                .concat([...lowerLettersKeys])
                                .concat([...baseKeys])
                        ),
                        (key: string) => KeyboardEventManager.emitKeyDown(key)
                    ).map((row, index) => {
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
