// @ts-ignore Can't find type declaration for module 'react-native-ui-lib/keyboard'
import { KeyboardRegistry } from 'react-native-ui-lib/keyboard';
import {
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    FlatList,
    View,
    ScrollView,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import KeyboardEventManager from 'utils/keyboardEventManager';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';
import {
    GestureDetector,
    Gesture,
    Directions,
} from 'react-native-gesture-handler';

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
    const nbColumns = 10;
    const startValue = 30;
    const endValue = 300;
    const viewPosition = useSharedValue(endValue);
    const keys: Map<string, string | JSX.Element> = new Map([
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

    const specialchars: string[] = [
        '!',
        '@',
        '#',
        '$',
        '%',
        '^',
        '&',
        '*',
        '(',
        ')',
        '_',
        '+',
        '-',
        '=',
        '{',
        '}',
        '[',
        ']',
        '|',
        '\\',
        ':',
        ';',
        '"',
        "'",
        '<',
        '>',
        ',',
        '.',
        '?',
        '/',
    ];

    useEffect(() => {
        if (isVisble) {
            viewPosition.value = withTiming(endValue);
        } else {
            viewPosition.value = withTiming(startValue);
        }
    }, [isVisble]);

    const test: string[] = ['1', '2', '3', '4', '5'];

    const fling = Gesture.Fling()
        .direction(Directions.RIGHT)
        .onFinalize(() => {
            console.log('fling');
        });
    return (
        <>
            <Animated.View
                style={{
                    height: viewPosition,
                }}
            >
                <View
                    className='bg-[rgb(50,50,50)] px-5'
                    style={[styles.keyboardContainer]}
                >
                    {false && (
                        <View
                            className='bg-[rgb(30,30,30)]'
                            style={{
                                height: 'auto',
                                margin: 5,
                                borderRadius: 10,
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: 5,
                            }}
                        >
                            <Text className='text-white justify-center'>
                                {test[1]}
                            </Text>

                            <Text className='text-white'>
                                <Text>{test[4] + '      '}</Text>
                                <TouchableOpacity>
                                    <Text className='text-white text-xl'>
                                        {test[0]}
                                    </Text>
                                </TouchableOpacity>
                                <Text>{'      ' + test[2]}</Text>
                            </Text>
                            <Text className='text-white'>{test[3]}</Text>
                        </View>
                    )}

                    {true && (
                        <>
                            {isVisble ? (
                                <TouchableOpacity onPress={onDismiss}>
                                    <AntDesign
                                        name='down'
                                        size={30}
                                        color='black'
                                    />
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity onPress={onOpen}>
                                    <AntDesign
                                        name='up'
                                        size={30}
                                        color='black'
                                    />
                                </TouchableOpacity>
                            )}
                            <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                            >
                                {specialchars.map((item) => {
                                    return (
                                        <TouchableOpacity
                                            key={item}
                                            className='bg-[rgb(30,30,30)]'
                                            style={{
                                                width:
                                                    Dimensions.get('window')
                                                        .width /
                                                    specialchars.length,
                                                height: 40,
                                                margin: 5,
                                                borderRadius: 10,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                            onPress={() => {
                                                KeyboardEventManager.emitKeyDown(
                                                    item
                                                );
                                            }}
                                        >
                                            <Text className='text-white'>
                                                {item}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>

                            <FlatList
                                className=''
                                numColumns={nbColumns}
                                data={Array.from(keys.keys())}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        className='bg-[rgb(30,30,30)]'
                                        style={{
                                            width:
                                                Dimensions.get('window').width /
                                                (nbColumns + 2),
                                            height: 40,
                                            margin: 5,
                                            borderRadius: 10,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                        onPress={() => {
                                            KeyboardEventManager.emitKeyDown(
                                                item
                                            );
                                        }}
                                    >
                                        <Text className='text-white'>
                                            {keys.get(item)}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </>
                    )}
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
