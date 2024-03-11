import { View } from 'react-native';
import React from 'react';
import ActivityBarItem from './ActivityBarItem';
import ActivityBarItemGroup from './ActivityBarItemGroup';

type ActivityBarType = React.FC<{ children: React.ReactNode }> & {
    Item: typeof ActivityBarItem;
    Group: typeof ActivityBarItemGroup;
};

const ActivityBar: ActivityBarType = function ({ children }) {
    const activityBarItems = React.Children.toArray(children).filter(
        (child) =>
            React.isValidElement(child) &&
            (child.type === ActivityBarItem ||
                child.type === ActivityBarItemGroup)
    );
    return (
        <View className='flex bg-[rgb(50,50,50)] justify-between'>
            {activityBarItems}
        </View>
    );
};

ActivityBar.Item = ActivityBarItem;
ActivityBar.Group = ActivityBarItemGroup;

export default ActivityBar;
