import {
    Modal as M,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import React from 'react';
export type CommonModalProps = {
    visible: boolean;
    onClose: () => void;
};
export type ModalProps = CommonModalProps & {
    children: React.ReactNode;
    name: string;
};
export default function Modal({
    children,
    visible,
    onClose,
    name,
}: ModalProps) {
    return (
        <M visible={visible} onRequestClose={onClose} transparent={true}>
            <TouchableOpacity
                activeOpacity={1}
                onPressOut={onClose}
                className='flex-1 justify-center items-center bg-[rgba(0,0,0,0.5)]'
            >
                <TouchableWithoutFeedback>
                    <View className='min-w-[50vw] bg-[rgb(50,50,50)] rounded-lg p-6 max-h-[60vh]'>
                        <View className='mb-4'>
                            <Text className='text-2xl text-white'>{name}</Text>
                        </View>
                        {children}
                    </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </M>
    );
}
