import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useWindowDimensions, View } from 'react-native';

import GestureKey from './GestureKey';
import { useState } from 'react';

import Key from './Key';

type BaseKeyboardProps = {
    onPress: (key: string) => void;
};

export default function BaseKeyboard({ onPress }: BaseKeyboardProps) {
    const [isMaj, setIsMaj] = useState<boolean>(false);
    const { width } = useWindowDimensions();

    // Add maj reset on touch pressed
    const onTouchPressed = (key: string) => {
        onPress(key);
        setIsMaj(false);
    };

    const keyWidth = width / 11;
    const keyMargin = keyWidth / 20;

    const baseKeys = new Map<string, string | JSX.Element>([
        ['Backspace', <Ionicons name='backspace' size={keyWidth / 5} />],
        [
            'Keyboard',
            <MaterialCommunityIcons
                name='keyboard-outline'
                size={keyWidth / 6}
            />,
        ],
        ['\n', <AntDesign name='enter' size={keyWidth / 6} />],
        [
            '\t',
            <MaterialCommunityIcons name='keyboard-tab' size={keyWidth / 6} />,
        ],
        [
            'Maj',
            <MaterialCommunityIcons
                name='apple-keyboard-shift'
                size={keyWidth / 6}
            />,
        ],
    ]);

    return (
        <View
            className='flex-col'
            style={{
                width: width,
            }}
        >
            <View className='flex-row'>
                {isMaj ? (
                    <>
                        <GestureKey
                            keys={upperLettersKeysFromAtoE}
                            onPress={onTouchPressed}
                            keyWidth={keyWidth}
                            keyMargin={keyMargin}
                        />
                        <GestureKey
                            keys={upperLettersKeysFromFtoJ}
                            onPress={onTouchPressed}
                            keyWidth={keyWidth}
                            keyMargin={keyMargin}
                        />
                        <GestureKey
                            keys={upperLettersKeysFromKtoO}
                            onPress={onTouchPressed}
                            keyWidth={keyWidth}
                            keyMargin={keyMargin}
                        />
                    </>
                ) : (
                    <>
                        <GestureKey
                            keys={lowerLettersKeysFromAtoE}
                            onPress={onTouchPressed}
                            keyWidth={keyWidth}
                            keyMargin={keyMargin}
                        />
                        <GestureKey
                            keys={lowerLettersKeysFromFtoJ}
                            onPress={onTouchPressed}
                            keyWidth={keyWidth}
                            keyMargin={keyMargin}
                        />
                        <GestureKey
                            keys={lowerLettersKeysFromKtoO}
                            onPress={onTouchPressed}
                            keyWidth={keyWidth}
                            keyMargin={keyMargin}
                        />
                    </>
                )}
                <GestureKey
                    keys={specialKeys3}
                    onPress={onTouchPressed}
                    keyWidth={keyWidth}
                    keyMargin={keyMargin}
                />

                <GestureKey
                    keys={specialKeys5}
                    onPress={onTouchPressed}
                    keyWidth={keyWidth}
                    keyMargin={keyMargin}
                />
                <GestureKey
                    keys={specialKeys7}
                    onPress={onTouchPressed}
                    keyWidth={keyWidth}
                    keyMargin={keyMargin}
                />

                <GestureKey
                    keys={specialKeys6}
                    onPress={onTouchPressed}
                    keyWidth={keyWidth}
                    keyMargin={keyMargin}
                />

                {isMaj ? (
                    <>
                        <GestureKey
                            keys={upperLettersKeysFromPtoT}
                            onPress={onTouchPressed}
                            keyWidth={keyWidth}
                            keyMargin={keyMargin}
                        />
                        <GestureKey
                            keys={upperLettersKeysFromUtoY}
                            onPress={onTouchPressed}
                            keyWidth={keyWidth}
                            keyMargin={keyMargin}
                        />
                        <GestureKey
                            keys={upperLettersKeysFromZToDot}
                            onPress={onTouchPressed}
                            keyWidth={keyWidth}
                            keyMargin={keyMargin}
                        />
                    </>
                ) : (
                    <>
                        <GestureKey
                            keys={lowerLettersKeysFromPtoT}
                            onPress={onTouchPressed}
                            keyWidth={keyWidth}
                            keyMargin={keyMargin}
                        />
                        <GestureKey
                            keys={lowerLettersKeysFromUtoY}
                            onPress={onTouchPressed}
                            keyWidth={keyWidth}
                            keyMargin={keyMargin}
                        />
                        <GestureKey
                            keys={lowerLettersKeysFromZToDot}
                            onPress={onTouchPressed}
                            keyWidth={keyWidth}
                            keyMargin={keyMargin}
                        />
                    </>
                )}
            </View>
            <View className='flex-row '>
                <GestureKey
                    keys={numKeysFrom0To4}
                    onPress={onTouchPressed}
                    keyWidth={keyWidth}
                    keyMargin={keyMargin}
                />
                <GestureKey
                    keys={specialKeys1}
                    onPress={onTouchPressed}
                    keyWidth={keyWidth}
                    keyMargin={keyMargin}
                />
                <GestureKey
                    keys={specialKeys2}
                    onPress={onTouchPressed}
                    keyWidth={keyWidth}
                    keyMargin={keyMargin}
                />

                <View
                    style={{
                        justifyContent: 'flex-end',
                    }}
                >
                    <Key
                        keyWidth={width - 6 * keyWidth - 14 * keyMargin}
                        keyMargin={keyMargin}
                        keyHeight={(keyWidth / 4) * 3}
                        keyPressed=' '
                        onPress={onTouchPressed}
                        value={' '}
                    />
                </View>
                <GestureKey
                    keys={specialKeys4}
                    onPress={onTouchPressed}
                    keyWidth={keyWidth}
                    keyMargin={keyMargin}
                />

                <GestureKey
                    keys={baseKeys}
                    onPress={(key: string) => {
                        if (key === 'Maj') {
                            setIsMaj(!isMaj);
                        } else {
                            onPress(key);
                        }
                    }}
                    keyWidth={keyWidth}
                    keyMargin={keyMargin}
                />

                <GestureKey
                    keys={numKeysFrom5To9}
                    onPress={onTouchPressed}
                    keyWidth={keyWidth}
                    keyMargin={keyMargin}
                />
            </View>
        </View>
    );
}

const numKeysFrom0To4 = new Map<string, string | JSX.Element>([
    ['0', '0'],
    ['1', '1'],
    ['2', '2'],
    ['3', '3'],
    ['4', '4'],
]);

const numKeysFrom5To9 = new Map<string, string | JSX.Element>([
    ['5', '5'],
    ['6', '6'],
    ['7', '7'],
    ['8', '8'],
    ['9', '9'],
]);

const lowerLettersKeysFromAtoE = new Map<string, string | JSX.Element>([
    ['a', 'a'],
    ['b', 'b'],
    ['c', 'c'],
    ['d', 'd'],
    ['e', 'e'],
]);

const lowerLettersKeysFromFtoJ = new Map<string, string | JSX.Element>([
    ['f', 'f'],
    ['g', 'g'],
    ['h', 'h'],
    ['i', 'i'],
    ['j', 'j'],
]);

const lowerLettersKeysFromKtoO = new Map<string, string | JSX.Element>([
    ['k', 'k'],
    ['l', 'l'],
    ['m', 'm'],
    ['n', 'n'],
    ['o', 'o'],
]);

const lowerLettersKeysFromPtoT = new Map<string, string | JSX.Element>([
    ['p', 'p'],
    ['q', 'q'],
    ['r', 'r'],
    ['s', 's'],
    ['t', 't'],
]);

const lowerLettersKeysFromUtoY = new Map<string, string | JSX.Element>([
    ['u', 'u'],
    ['v', 'v'],
    ['w', 'w'],
    ['x', 'x'],
    ['y', 'y'],
]);

const lowerLettersKeysFromZToDot = new Map<string, string | JSX.Element>([
    ['z', 'z'],
    ['.', '.'],
    [',', ','],
    [';', ';'],
    [':', ':'],
]);

const upperLettersKeysFromAtoE = new Map<string, string | JSX.Element>([
    ['A', 'A'],
    ['B', 'B'],
    ['C', 'C'],
    ['D', 'D'],
    ['E', 'E'],
]);

const upperLettersKeysFromFtoJ = new Map<string, string | JSX.Element>([
    ['F', 'F'],
    ['G', 'G'],
    ['H', 'H'],
    ['I', 'I'],
    ['J', 'J'],
]);

const upperLettersKeysFromKtoO = new Map<string, string | JSX.Element>([
    ['K', 'K'],
    ['L', 'L'],
    ['M', 'M'],
    ['N', 'N'],
    ['O', 'O'],
]);

const upperLettersKeysFromPtoT = new Map<string, string | JSX.Element>([
    ['P', 'P'],
    ['Q', 'Q'],
    ['R', 'R'],
    ['S', 'S'],
    ['T', 'T'],
]);

const upperLettersKeysFromUtoY = new Map<string, string | JSX.Element>([
    ['U', 'U'],
    ['V', 'V'],
    ['W', 'W'],
    ['X', 'X'],
    ['Y', 'Y'],
]);

const upperLettersKeysFromZToDot = new Map<string, string | JSX.Element>([
    ['Z', 'Z'],
    ['.', '.'],
    [',', ','],
    [';', ';'],
    [':', ':'],
]);

const specialKeys1 = new Map<string, string | JSX.Element>([
    ['\\', '\\'],
    ['&', '&'],
    ['}', '}'],
    ['|', '|'],
    ['{', '{'],
]);

const specialKeys2 = new Map<string, string | JSX.Element>([
    ['_', '_'],
    ['?', '?'],
    [']', ']'],
    ['!', '!'],
    ['[', '['],
]);

const specialKeys3 = new Map<string, string | JSX.Element>([
    ['%', '%'],
    ['>', '>'],
    [')', ')'],
    ['<', '<'],
    ['(', '('],
]);

const specialKeys4 = new Map<string, string | JSX.Element>([
    ['=', '='],
    ['+', '+'],
    ['*', '*'],
    ['-', '-'],
    ['/', '/'],
]);

const specialKeys5 = new Map<string, string | JSX.Element>([
    ['"', '"'],
    ['#', '#'],
    ['@', '@'],
    ['$', '$'],

    ['`', '`'],
]);

const specialKeys6 = new Map<string, string | JSX.Element>([
    ['^', '^'],
    ['§', '§'],
    ['°', '°'],
    ['µ', 'µ'],
    ['~', '~'],
]);

const specialKeys7 = new Map<string, string | JSX.Element>([
    ["'", "'"],
    ['é ', 'é'],
    ['è', 'è'],
    ['à', 'à'],
    ['ç', 'ç'],
]);
