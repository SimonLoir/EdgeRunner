import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {
    Gesture,
    GestureDetector,
    GestureStateChangeEvent,
} from 'react-native-gesture-handler';
import { runOnJS, useSharedValue } from 'react-native-reanimated';
import KeyboardEventManager from 'utils/keyboardEventManager';

type GestureKeyProps = {
    keys: Map<string, string | JSX.Element>;
    onPress?: (key: string) => void;
};

export default function GestureKey({ keys, onPress }: GestureKeyProps) {
    if (keys.size !== 9) {
        return null;
    }

    const initPosition = useSharedValue<{ x: number; y: number } | null>(null);
    const finalPosition = useSharedValue<{ x: number; y: number } | null>(null);
    const selectedPosition = useSharedValue<string>('C');

    const width = 70;
    const height = 70;
    const sensibillity = 10;

    const position = ['NW', 'N', 'NE', 'W', 'C', 'E', 'SW', 'S', 'SE'];

    const square = [
        Array.from(keys.values()).slice(0, 3),
        Array.from(keys.values()).slice(3, 6),
        Array.from(keys.values()).slice(6, 9),
    ];

    const squareKeys = [
        Array.from(keys.keys()).slice(0, 3),
        Array.from(keys.keys()).slice(3, 6),
        Array.from(keys.keys()).slice(6, 9),
    ];

    const fling = Gesture.Fling()
        .onBegin((event) => {
            console.log('onBegin');

            initPosition.value = { x: event.x, y: event.y };
            finalPosition.value = null;
        })
        .onFinalize((event) => {
            console.log('onFinalize');

            finalPosition.value = { x: event.x, y: event.y };

            if (initPosition.value && finalPosition.value) {
                const dx = finalPosition.value.x - initPosition.value.x;
                const dy = finalPosition.value.y - initPosition.value.y;
                if (false) {
                    if (Math.abs(dx) > Math.abs(dy)) {
                        if (dx > sensibillity) {
                            if (dy > sensibillity) {
                                selectedPosition.value = 'SE';
                            } else if (dy < -sensibillity) {
                                selectedPosition.value = 'NE';
                            } else {
                                selectedPosition.value = 'E';
                            }
                        } else if (dx < -sensibillity) {
                            if (dy > sensibillity) {
                                selectedPosition.value = 'SW';
                            } else if (dy < -sensibillity) {
                                selectedPosition.value = 'NW';
                            } else {
                                selectedPosition.value = 'W';
                            }
                        } else {
                            selectedPosition.value = 'C';
                        }
                    } else {
                        if (dy > sensibillity) {
                            if (dx > sensibillity) {
                                selectedPosition.value = 'SE';
                            } else if (dx < -sensibillity) {
                                selectedPosition.value = 'SW';
                            } else {
                                selectedPosition.value = 'S';
                            }
                        } else if (dy < -sensibillity) {
                            if (dx > sensibillity) {
                                selectedPosition.value = 'NE';
                            } else if (dx < -sensibillity) {
                                selectedPosition.value = 'NW';
                            } else {
                                selectedPosition.value = 'N';
                            }
                        } else {
                            selectedPosition.value = 'C';
                        }
                    }
                }

                const index = position.indexOf(selectedPosition.value);

                runOnJS(() =>
                    KeyboardEventManager.emitKeyDown(
                        squareKeys[Math.floor(index / 3)][index % 3]
                    )
                );
            }
        });

    return (
        <View
            className=' bg-yellow-400 items-center flex-col'
            style={{
                width: width,
                height: height,
            }}
        >
            {square.map((row, rowIndex) => {
                return (
                    <View key={rowIndex} className='flex-row'>
                        {row.map((key, keyIndex) => {
                            return (
                                <View
                                    className='items-center justify-center'
                                    style={{
                                        width:
                                            keyIndex === 1
                                                ? (width * 2) / 3
                                                : width / 6,
                                        height: width / 3,
                                    }}
                                    key={keyIndex}
                                >
                                    {rowIndex === 1 && keyIndex === 1 ? (
                                        <GestureDetector gesture={fling}>
                                            <TouchableOpacity>
                                                <Text className='text-2xl'>
                                                    {key}
                                                </Text>
                                            </TouchableOpacity>
                                        </GestureDetector>
                                    ) : (
                                        <Text className='text-xs'>{key}</Text>
                                    )}
                                </View>
                            );
                        })}
                    </View>
                );
            })}
        </View>
    );
}
