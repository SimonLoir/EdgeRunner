import React from 'react';
import { Dimensions, TouchableWithoutFeedback, View } from 'react-native';
import { Menu, PaperProvider, MD3DarkTheme } from 'react-native-paper';

type ClickableMenuProps = {
    position: {
        x: number;
        y: number;
    };
    onClickOutside: () => void;
    items: React.ReactNode[];
    visible: boolean;
};

export default function ClickableMenu(props: ClickableMenuProps) {
    const { position, onClickOutside, items, visible } = props;

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
                    {items}
                </Menu>
            </PaperProvider>
        </View>
    );
}
