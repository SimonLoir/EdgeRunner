import {
    Keyboard,
    PixelRatio,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import React, { useEffect, useState } from 'react';

import {
    KeyboardUtils,
    KeyboardRegistry,
    KeyboardAccessoryView, // @ts-ignore Can't find type declaration for module 'react-native-ui-lib/keyboard'
} from 'react-native-ui-lib/keyboard';
import {
    Constants,
    Assets,
    Colors,
    Spacings,
    TextField,
    Button,
    Switch,
} from 'react-native-ui-lib';
import CodeKeyboard from './CodeKeyboard';
import { on } from 'events';

KeyboardRegistry.registerKeyboard('CodeKeyboard', () => CodeKeyboard);

type props = {
    children: React.ReactNode;
    onChangeText: (text: string) => void;
    keyboard: string;
    text: string | undefined;
};
export default function CustomKeyboardTextInput({
    children,
    keyboard,
    onChangeText,
    text,
}: props) {
    const [receivedKeyboardData, setReceivedKeyboardData] = useState<
        undefined | { key: string }
    >(undefined);
    const [textInputRef, setTextInputRef] = useState<TextInput | null>(null);
    const [keyboardOpen, setKeyboardOpen] = useState(false);
    const [useSafeArea, setUseSafeArea] = useState(true);
    const [customKeyboard, setCustomKeyboard] = useState<{
        component: string | undefined;
        initialProps: any | undefined;
    }>({
        component: undefined,
        initialProps: undefined,
    });
    const [selectionStart, setSelectionStart] = useState<number>(0);
    const [selectionEnd, setSelectionEnd] = useState<number>(0);

    useEffect(() => {
        if (text !== undefined && receivedKeyboardData !== undefined) {
            const newText =
                text.slice(0, selectionStart) +
                receivedKeyboardData.key +
                text.slice(selectionEnd);
            onChangeText(newText);
        }
    }, [receivedKeyboardData]);

    const onKeyboardResigned = () => {
        resetKeyboardView();
    };

    const isCustomKeyboardOpen = () => {
        return keyboardOpen && customKeyboard.component !== undefined;
    };

    const resetKeyboardView = () => {
        setCustomKeyboard({ component: undefined, initialProps: undefined });
    };

    const dismissKeyboard = () => {
        KeyboardUtils.dismiss();
        setKeyboardOpen(false);
    };

    const toggleUseSafeArea = () => {
        setUseSafeArea(!useSafeArea);

        if (isCustomKeyboardOpen()) {
            dismissKeyboard();
            showLastKeyboard();
        }
    };

    const showLastKeyboard = () => {
        const ckb = customKeyboard;
        setCustomKeyboard({ component: undefined, initialProps: undefined });

        setKeyboardOpen(true);
        setCustomKeyboard(ckb);
    };

    const showKeyboardView = (component: string, initialProps: any) => {
        setKeyboardOpen(true);
        setCustomKeyboard({ component, initialProps });
    };

    const renderKeyboardAccessoryViewContent = () => {
        return (
            <View>
                <Text
                    className='text-white'
                    onPress={() => showKeyboardView(keyboard, undefined)}
                >
                    open
                </Text>
                <Text className='text-white' onPress={() => dismissKeyboard()}>
                    close
                </Text>
            </View>
        );
    };

    const requestShowKeyboard = () => {
        KeyboardRegistry.requestShowKeyboard(keyboard);
    };

    const onRequestShowKeyboard = (keyboardId: string) => {
        setCustomKeyboard({ component: keyboardId, initialProps: undefined });
    };
    const onKeyboardItemSelected = (keyboardId?: string, params?: any) => {
        const receivedKeyboardData: string = params.key || '';

        setReceivedKeyboardData({ key: receivedKeyboardData });
    };

    return (
        <View>
            <TextInput
                ref={setTextInputRef}
                className={'text-white'}
                multiline
                onChangeText={onChangeText}
                autoCapitalize={'none'}
                autoCorrect={false}
                showSoftInputOnFocus={false}
                onFocus={() => showKeyboardView(keyboard, undefined)}
                onSelectionChange={(event) => {
                    setSelectionStart(event.nativeEvent.selection.start);
                    setSelectionEnd(event.nativeEvent.selection.end);
                }}
            >
                {children}
            </TextInput>

            <Text className='text-white'> {selectionStart}</Text>
            <Text className='text-white'> {selectionEnd}</Text>

            <KeyboardAccessoryView
                renderContent={renderKeyboardAccessoryViewContent}
                trackInteractive={true}
                kbInputRef={textInputRef}
                kbComponent={customKeyboard.component}
                kbInitialProps={customKeyboard.initialProps}
                onItemSelected={onKeyboardItemSelected}
                onKeyboardResigned={onKeyboardResigned}
                onRequestShowKeyboard={onRequestShowKeyboard}
                revealKeyboardInteractive
                scrollBehavior={KeyboardAccessoryView.scrollBehaviors.NONE}
            />
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
