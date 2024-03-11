import {
    Modal,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import React from 'react';

type ModalProps = {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
};

export default function AppModal({ visible, onClose, children }: ModalProps) {
    return (
        <View>
            <Modal
                visible={visible}
                animationType='slide'
                onRequestClose={onClose}
                transparent={true}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPressOut={onClose}
                    style={{
                        flex: 1,
                        justifyContent: 'center', //Centered vertically
                        alignItems: 'center',
                    }}
                >
                    <TouchableWithoutFeedback>
                        <View
                            style={{
                                backgroundColor: 'rgb(15 23 42)',
                                borderTopRightRadius: 10,
                                borderTopLeftRadius: 10,
                                borderBottomLeftRadius: 10,
                                borderBottomRightRadius: 10,
                                padding: 20,
                            }}
                        >
                            {children}
                        </View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}
