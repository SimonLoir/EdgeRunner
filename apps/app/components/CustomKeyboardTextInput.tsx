import {
    PixelRatio,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
    ScrollView,
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
    const { children, keyboard, onChangeText, text, ...rest } = props;
    const [receivedKeyboardData, setReceivedKeyboardData] = useState<
        undefined | { key: string }
    >(undefined);
    const [recieveKeyboardCompletionData, setRecieveKeyboardCompletionData] =
        useState<undefined | { item: string }>(undefined);

    const [useSafeArea, setUseSafeArea] = useState(true);
    const [selectionStart, setSelectionStart] = useState<number>(0);
    const [selectionEnd, setSelectionEnd] = useState<number>(0);

    const keyboardContext = useContext(KeyboardContext);

    const openKeyboard = () => {
        keyboardContext.setIsKeyboardOpen(true);
        KeyboardEventManager.updateKeyDownCallback(onKeyboardItemSelected);
        KeyboardEventManager.updateCompletionItemDownCallback(
            onKeyboardCompletionItemSelected
        );
    };

    useEffect(() => {
        if (text !== undefined && receivedKeyboardData !== undefined) {
            let newText = '';
            if (receivedKeyboardData.key === 'Backspace') {
                newText =
                    text.slice(0, selectionStart - 1) +
                    text.slice(selectionEnd);
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

    const dismissKeyboard = () => {
        keyboardContext.setIsKeyboardOpen(false);
        KeyboardEventManager.removeKeyDownCallback();
        KeyboardEventManager.removeCompletionItemDownCallback();
    };

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
                    showSoftInputOnFocus={false}
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

const COLOR = '#F5FCFF';
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR,
    },
    scrollContainer: {
        justifyContent: 'center',
        padding: 15,
        flex: 1,
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        paddingTop: 50,
        paddingBottom: 50,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 25,
    },
    keyboardContainer: {
        ...Platform.select({
            ios: {
                flex: 1,
                backgroundColor: COLOR,
            },
        }),
    },
    textInput: {
        flex: 1,
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 10,
        paddingLeft: 10,
        paddingTop: 2,
        paddingBottom: 5,
        fontSize: 16,
        backgroundColor: 'white',
        borderWidth: 0.5 / PixelRatio.get(),
        borderRadius: 18,
    },
    sendButton: {
        paddingRight: 15,
        paddingLeft: 15,
        alignSelf: 'center',
    },
    switch: {
        marginLeft: 15,
    },
    safeAreaSwitchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
