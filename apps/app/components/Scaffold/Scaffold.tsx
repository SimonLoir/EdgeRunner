import { View } from 'react-native';
import React from 'react';
import ActivityBar from './ActivityBar';
import Main from './Main';
import SidePanel from './SidePanel';
import { PanelPage, ScaffoldContext } from './context/ScaffoldContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ScaffoldType = React.FC<{
    children?: React.ReactNode;
}> & {
    ActivityBar: typeof ActivityBar;
    Main: typeof Main;
    SidePanel: typeof SidePanel;
};
const Scaffold: ScaffoldType = function ({ children }) {
    /**
     * The activity bar is located on the left side of the screen and contains icons for different actions.
     */
    const activityBar = React.Children.toArray(children).find(
        (child) => React.isValidElement(child) && child.type === ActivityBar
    ) as React.ReactElement | null;

    /**
     * The main content of the app. Contains the code editor.
     */
    const main = React.Children.toArray(children).find(
        (child) => React.isValidElement(child) && child.type === Main
    ) as React.ReactElement | null;

    /**
     * The side panel is located on the right side of the activity bar and contains additional information or settings.
     * It can be opened and closed by clicking on some icon in the activity bar.
     */
    const sidePanel = React.Children.toArray(children).find(
        (child) => React.isValidElement(child) && child.type === SidePanel
    ) as React.ReactElement | null;

    const [sidePanelOpen, setSidePanelOpen] = React.useState(true);
    const [sidePanelPage, setSidePanelPage] =
        React.useState<PanelPage>('file-explorer');

    const insets = useSafeAreaInsets();

    return (
        <ScaffoldContext.Provider
            value={{
                sidePanelOpen,
                setSidePanelOpen,
                sidePanelPage,
                setSidePanelPage,
            }}
        >
            <View
                className='flex flex-1 bg-[rgb(40,40,40)] flex-row'
                style={{
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                }}
            >
                {activityBar ?? null}
                <View className='z-10'>{sidePanel ?? null}</View>
                {main ?? null}
            </View>
        </ScaffoldContext.Provider>
    );
};

Scaffold.ActivityBar = ActivityBar;
Scaffold.Main = Main;
Scaffold.SidePanel = SidePanel;

export default Scaffold;
