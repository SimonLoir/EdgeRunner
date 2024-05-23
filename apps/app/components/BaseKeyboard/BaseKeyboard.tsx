import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useWindowDimensions, View } from 'react-native';
import GestureKey from '../GestureKey';
import { useState } from 'react';
import Key from '../Key';
import {
    lowerLettersKeysFromAtoE,
    lowerLettersKeysFromFtoJ,
    lowerLettersKeysFromKtoO,
    lowerLettersKeysFromPtoT,
    lowerLettersKeysFromUtoY,
    lowerLettersKeysFromZToDot,
    numKeysFrom0To4,
    numKeysFrom5To9,
    specialKeys1,
    specialKeys2,
    specialKeys3,
    specialKeys4,
    specialKeys5,
    specialKeys6,
    specialKeys7,
    upperLettersKeysFromAtoE,
    upperLettersKeysFromFtoJ,
    upperLettersKeysFromKtoO,
    upperLettersKeysFromPtoT,
    upperLettersKeysFromUtoY,
    upperLettersKeysFromZToDot,
} from './keys';

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

    const baseKeys = new Map<string, string | React.JSX.Element>([
        [
            'Backspace',
            <Ionicons name='backspace' size={keyWidth / 5} key='backspace' />,
        ],
        [
            'Keyboard',
            <MaterialCommunityIcons
                name='keyboard-outline'
                size={keyWidth / 6}
                key='keyboard'
            />,
        ],
        ['\n', <AntDesign name='enter' size={keyWidth / 6} key='enter' />],
        [
            '\t',
            <MaterialCommunityIcons
                name='keyboard-tab'
                size={keyWidth / 6}
                key='tab'
            />,
        ],
        [
            'Maj',
            <MaterialCommunityIcons
                name='apple-keyboard-shift'
                size={keyWidth / 6}
                key='maj'
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
                <GestureKey
                    keys={
                        isMaj
                            ? upperLettersKeysFromAtoE
                            : lowerLettersKeysFromAtoE
                    }
                    onPress={onTouchPressed}
                    keyWidth={keyWidth}
                    keyMargin={keyMargin}
                />

                <GestureKey
                    keys={
                        isMaj
                            ? upperLettersKeysFromFtoJ
                            : lowerLettersKeysFromFtoJ
                    }
                    onPress={onTouchPressed}
                    keyWidth={keyWidth}
                    keyMargin={keyMargin}
                />

                <GestureKey
                    keys={
                        isMaj
                            ? upperLettersKeysFromKtoO
                            : lowerLettersKeysFromKtoO
                    }
                    onPress={onTouchPressed}
                    keyWidth={keyWidth}
                    keyMargin={keyMargin}
                />

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

                <GestureKey
                    keys={
                        isMaj
                            ? upperLettersKeysFromPtoT
                            : lowerLettersKeysFromPtoT
                    }
                    onPress={onTouchPressed}
                    keyWidth={keyWidth}
                    keyMargin={keyMargin}
                />
                <GestureKey
                    keys={
                        isMaj
                            ? upperLettersKeysFromUtoY
                            : lowerLettersKeysFromUtoY
                    }
                    onPress={onTouchPressed}
                    keyWidth={keyWidth}
                    keyMargin={keyMargin}
                />
                <GestureKey
                    keys={
                        isMaj
                            ? upperLettersKeysFromZToDot
                            : lowerLettersKeysFromZToDot
                    }
                    onPress={onTouchPressed}
                    keyWidth={keyWidth}
                    keyMargin={keyMargin}
                />
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
