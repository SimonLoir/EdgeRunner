import React from 'react';
import { View } from 'react-native';

export default function Main({ children }: { children: React.ReactNode }) {
    return <View className='flex-1'>{children}</View>;
}
