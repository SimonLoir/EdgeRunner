import React from 'react';
import { Dimensions, TouchableWithoutFeedback, View } from 'react-native';
import { Menu, PaperProvider } from 'react-native-paper';

type ClickableMenuProps = {
    position: {
        x: number;
        y: number;
    };
    onClickOutside: () => void;
    children: React.ReactNode;
    visible: boolean;
};

export default function ClickableMenu(props: ClickableMenuProps) {
    const { position, onClickOutside, children, visible } = props;
    console.log(
        Dimensions.get('window').width,
        Dimensions.get('window').height
    );

    return (
        <View>
            {visible && (
                <TouchableWithoutFeedback onPress={onClickOutside}>
                    <View
                        style={{
                            position: 'absolute',
                            width: Dimensions.get('window').width,
                            height: Dimensions.get('window').height,
                            backgroundColor: 'transparent',
                        }}
                    />
                </TouchableWithoutFeedback>
            )}

            <PaperProvider>
                <Menu
                    visible={visible}
                    onDismiss={onClickOutside}
                    anchor={{ x: 0, y: 0 }}
                    style={{
                        position: 'absolute',
                        top: position.y,
                        left: position.x,
                        zIndex: 2,
                    }}
                >
                    {children}
                </Menu>
            </PaperProvider>
        </View>
    );
}
