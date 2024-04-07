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

import DropDownPicker from 'react-native-dropdown-picker';

const preKeys = new Map<number, string>([
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
const upperLettersKeys = new Map<string, string | JSX.Element>([
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

const lowerLettersKeys = new Map<string, string | JSX.Element>([
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

const baseKeys = new Map<string, string | JSX.Element>([
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

    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [dropDownValue, setIsDropdownValue] = useState<null | string>(null);

    useEffect(() => {
        if (isVisble) {
            viewPosition.value = withTiming(endValue);
        } else {
            viewPosition.value = withTiming(startValue);
        }
    }, [isVisble]);

    useEffect(() => {
        setIsDropdownOpen(false);
    }, [keyBoardItems]);

    const keyElement = (
        key: string,
        value: string | JSX.Element,
        onPress: (key: string) => void
    ) => {
        return (
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
    };

    const generateKeyboard = (
        keys: Map<string, string | JSX.Element>,
        onPress: (key: string) => void,
        selectAfterTen: boolean = false
    ) => {
        const keyboard = [];
        let row = [];
        let selectedItems = [];
        let i = 0;

        for (const [key, value] of keys.entries()) {
            if (!selectAfterTen || i < nbColumns - 1) {
                row.push(keyElement(key, value, onPress));
            } else {
                selectedItems.push(key);
            }
            i++;
            if (i === nbColumns && !selectAfterTen) {
                keyboard.push(row);
                row = [];
                i = 0;
            }
        }

        if (selectedItems.length > 0) {
            row.push(
                <View
                    key='select'
                    className='bg-[rgb(30,30,30)]'
                    style={{
                        width: width / (nbColumns + 2),
                        margin: keyMargin,
                        borderRadius: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 0,
                    }}
                >
                    <DropDownPicker
                        items={selectedItems.map((item) => {
                            return { label: item, value: item, key: item };
                        })}
                        placeholder={selectedItems[0]}
                        value={dropDownValue}
                        open={isDropdownOpen}
                        setOpen={setIsDropdownOpen}
                        setValue={setIsDropdownValue}
                        onSelectItem={(item) => {
                            if (item.label) onPress(item.label);
                        }}
                        listMode='SCROLLVIEW'
                        zIndex={10}
                        scrollViewProps={{
                            nestedScrollEnabled: true,
                        }}
                    />
                </View>
            );
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
                                keyBoardItems.map((item) => [
                                    item.label,
                                    item.label,
                                ])
                            ),
                            (key: string) => {
                                KeyboardEventManager.emitCompletionItemDown(
                                    key
                                );
                            },
                            true
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
