import {
    TextInput,
    View,
    KeyboardAvoidingView,
    TextInputProps,
} from 'react-native';
import React, {
    forwardRef,
    useContext,
    useEffect,
    useImperativeHandle,
    useState,
} from 'react';
import KeyboardEventManager from 'utils/keyboardEventManager';
import { KeyboardContext } from '../utils/keyboardContext';
import getCharPositionFromPosition from '../utils/getCharPositionFromPosition';

export type CustomKeyboardTextInputRef = {
    setCursorPosition(line: number, character: number): void;
};

type CustomKeyboardTextInputProps = TextInputProps & {
    children: React.ReactNode;
    onChangeText: (text: string) => void;
    keyboard: string;
    text: string | undefined;
};
const CustomKeyboardTextInput = forwardRef<
    CustomKeyboardTextInputRef,
    CustomKeyboardTextInputProps
>(function CustomKeyboardTextInput(props: CustomKeyboardTextInputProps, ref) {
    const textInputRef = React.useRef<TextInput>(null);
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

    useImperativeHandle(
        ref,
        () => {
            return {
                setCursorPosition: (line: number, character: number) => {
                    if (textInputRef.current === null || !text) return;
                    const position = getCharPositionFromPosition(text, {
                        line,
                        character,
                    });
                    textInputRef.current.focus();
                    textInputRef.current.setSelection(position, position);
                },
            };
        },
        [text]
    );

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
                    ref={textInputRef}
                >
                    {children}
                </TextInput>
            </KeyboardAvoidingView>
        </View>
    );
});

export default CustomKeyboardTextInput;
