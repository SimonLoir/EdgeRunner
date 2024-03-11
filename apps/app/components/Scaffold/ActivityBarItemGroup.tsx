import { View } from 'react-native';
import React from 'react';
import ActivityBarItem from './ActivityBarItem';

type ActivityBarItemGroupProps = {
    children: React.ReactNode;
};
export default function ActivityBarItemGroup({
    children,
}: ActivityBarItemGroupProps) {
    const activityBarItems = React.Children.toArray(children).filter(
        (child) => React.isValidElement(child) && child.type === ActivityBarItem
    );
    return <View>{activityBarItems}</View>;
}
