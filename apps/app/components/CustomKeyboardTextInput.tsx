import {
    TextInput,
    View,
    KeyboardAvoidingView,
    TextInputProps,
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import KeyboardEventManager from 'utils/keyboardEventManager';
import { KeyboardContext } from '../utils/keyboardContext';

type props = TextInputProps & {
    children: React.ReactNode;
    onChangeText: (text: string) => void;
    keyboard: string;
    text: string | undefined;
};
export default function CustomKeyboardTextInput(props: props) {
    const { children, onChangeText, text, ...rest } = props;
    const [receivedKeyboardData, setReceivedKeyboardData] = useState<
        undefined | { key: string }
    >(undefined);
    const [recieveKeyboardCompletionData, setRecieveKeyboardCompletionData] =
        useState<undefined | { item: string }>(undefined);

    const [selectionStart, setSelectionStart] = useState<number>(0);
    const [selectionEnd, setSelectionEnd] = useState<number>(0);

    const keyboardContext = useContext(KeyboardContext);

    const openKeyboard = () => {
        if (keyboardContext.enableNativeKeyboard) {
            return;
        }
        keyboardContext.setIsKeyboardOpen(true);
        KeyboardEventManager.updateKeyDownCallback(onKeyboardItemSelected);
        KeyboardEventManager.updateCompletionItemDownCallback(
            onKeyboardCompletionItemSelected
        );
    };

    useEffect(() => {
        if (text !== undefined && receivedKeyboardData !== undefined) {
            let newText = '';

            if (receivedKeyboardData.key === 'Keyboard') {
                keyboardContext.setEnableNativeKeyboard(true);
                keyboardContext.setIsKeyboardOpen(false);
                return;
            } else if (receivedKeyboardData.key === 'Backspace') {
                if (selectionStart === selectionEnd) {
                    newText =
                        text.slice(0, selectionStart - 1) +
                        text.slice(selectionEnd);
                } else {
                    newText =
                        text.slice(0, selectionStart) +
                        text.slice(selectionEnd);
                }
            } else {
                newText =
                    text.slice(0, selectionStart) +
                    receivedKeyboardData.key +
                    text.slice(selectionEnd);
            }
            onChangeText(newText);
        }
    }, [receivedKeyboardData]);

    useEffect(() => {
        if (text !== undefined && recieveKeyboardCompletionData !== undefined) {
            let newText = '';

            newText = text.slice(0, selectionStart);

            const receivedKeyboardCompletionDataItemLength =
                recieveKeyboardCompletionData.item.length;

            let i = receivedKeyboardCompletionDataItemLength;
            while (i >= 0) {
                const matchingWord = recieveKeyboardCompletionData.item.slice(
                    0,
                    i
                );

                if (newText.endsWith(matchingWord)) {
                    break;
                }
                i--;
            }

            newText =
                newText +
                recieveKeyboardCompletionData.item.slice(
                    i,
                    receivedKeyboardCompletionDataItemLength
                ) +
                text.slice(selectionEnd);
            onChangeText(newText);
        }
    }, [recieveKeyboardCompletionData]);

    const onKeyboardItemSelected = (key: string) => {
        setReceivedKeyboardData({ key: key });
    };

    const onKeyboardCompletionItemSelected = (item: string) => {
        setRecieveKeyboardCompletionData({ item: item });
    };

    return (
        <View>
            <KeyboardAvoidingView enabled={true}>
                <TextInput
                    {...rest}
                    className={'text-white'}
                    multiline
                    onChangeText={onChangeText}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    showSoftInputOnFocus={keyboardContext.enableNativeKeyboard}
                    onFocus={() => openKeyboard()}
                    onSelectionChange={(event) => {
                        setSelectionStart(event.nativeEvent.selection.start);
                        setSelectionEnd(event.nativeEvent.selection.end);
                        openKeyboard();
                        if (rest.onSelectionChange) {
                            rest.onSelectionChange(event);
                        }
                    }}
                >
                    {children}
                </TextInput>
            </KeyboardAvoidingView>
        </View>
    );
}
