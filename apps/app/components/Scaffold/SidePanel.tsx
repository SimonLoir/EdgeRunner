import { View } from 'react-native';
import useScaffoldContext from './context/useScaffoldContext';
import React from 'react';
import SidePanelPage from './SidePanelPage';

type SidePanelProps = {
    children: React.ReactNode;
};

type SidePanelType = React.FC<SidePanelProps> & {
    Page: typeof SidePanelPage;
};

const SidePanel: SidePanelType = function ({
    children = null,
}: {
    children?: React.ReactNode;
}) {
    const { sidePanelOpen, sidePanelPage } = useScaffoldContext();
    if (!sidePanelOpen || !sidePanelPage) return <></>;

    const page = React.Children.toArray(children).find(
        (child) =>
            React.isValidElement(child) &&
            child.type === SidePanelPage &&
            child.props.name === sidePanelPage
    );

    if (!page) return <></>;

    return <View className='w-72 p-5'>{page}</View>;
};

SidePanel.Page = SidePanelPage;

export default SidePanel;
