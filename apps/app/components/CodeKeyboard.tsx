// @ts-ignore Can't find type declaration for module 'react-native-ui-lib/keyboard'
import { TouchableOpacity, View, useWindowDimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import KeyboardEventManager from 'utils/keyboardEventManager';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';
import { z } from 'zod';
import { completionItemSchema } from '@/schemas/exportedSchemas';
import { Dropdown } from 'react-native-element-dropdown';
import BaseKeyboard from './BaseKeyboard';
import Key from './Key';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type CodeKeyboardProps = {
    onDismiss: () => void;
    isVisble: boolean;
    onOpen: () => void;
    keyBoardItems: z.infer<typeof completionItemSchema>[];
    isNativeKeyboardEnabled: boolean;
};

export default function CodeKeyboard({
    onDismiss,
    isVisble,
    isNativeKeyboardEnabled,
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
                row.push(
                    <View key={key}>
                        <Key
                            keyPressed={key}
                            value={value}
                            onPress={onPress}
                            keyHeight={keyHeight}
                            keyMargin={keyMargin}
                            keyWidth={width / (nbColumns + 2)}
                        />
                    </View>
                );
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
                    <Dropdown
                        style={{
                            width: width / (nbColumns + 2),
                        }}
                        containerStyle={{
                            width: width / (nbColumns + 2),
                            marginBottom: 20,
                            backgroundColor: 'rgb(50,50,50)',
                            borderRadius: 10,
                            borderColor: 'rgb(50,50,50)',
                        }}
                        itemContainerStyle={{
                            backgroundColor: 'rgb(30,30,30)',
                            borderRadius: 10,
                            margin: keyMargin,

                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        itemTextStyle={{
                            color: 'white',
                            textAlign: 'center',
                            fontSize: 14,
                        }}
                        placeholderStyle={{
                            color: 'white',
                            textAlign: 'center',
                            fontSize: 14,
                        }}
                        selectedTextStyle={{
                            color: 'white',
                            textAlign: 'center',
                            fontSize: 14,
                        }}
                        data={selectedItems.map((item) => {
                            return { label: item, value: item };
                        })}
                        autoScroll
                        inverted={false}
                        maxHeight={300}
                        minHeight={100}
                        labelField='label'
                        valueField='value'
                        value={dropDownValue}
                        onChange={(item) => {
                            if (item.label) onPress(item.label);
                        }}
                        placeholder={selectedItems[0]}
                        dropdownPosition='top'
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
                            {isNativeKeyboardEnabled ? (
                                <MaterialCommunityIcons
                                    name='keyboard-outline'
                                    size={30}
                                    color='white'
                                />
                            ) : (
                                <AntDesign name='up' size={30} color='white' />
                            )}
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
                            false
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

                    <BaseKeyboard
                        onPress={(key: string) => {
                            KeyboardEventManager.emitKeyDown(key);
                        }}
                    />
                </View>
            </Animated.View>
        </>
    );
}
