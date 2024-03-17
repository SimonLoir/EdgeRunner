import '../global.css';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { links, trpc, trpcClient } from '../utils/api';
import { createContext, useMemo, useState } from 'react';
import Scaffold from '../components/Scaffold';
import Workspace from '../utils/workspace/Workspace';
import WorkspaceContext from '../utils/workspace/WorkspaceContext';
import FileExplorer from '../components/SidePanel/pages/FileExplorer';
import WorkspaceInitializer from '../components/WorkspaceInitializer';
import CodeKeyboard from 'components/CodeKeyboard';

const queryClient = new QueryClient();
export const KeyboardContext = createContext({
    isKeyboardOpen: false,
    setIsKeyboardOpen: (value: boolean) => {},
});

export default function Layout() {
    const [trpcReactClient] = useState(() =>
        trpc.createClient({
            links,
        })
    );
    const [workspace] = useState(() => new Workspace(trpcClient));
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

    return (
        <KeyboardContext.Provider
            value={{
                isKeyboardOpen,
                setIsKeyboardOpen,
            }}
        >
            <trpc.Provider queryClient={queryClient} client={trpcReactClient}>
                <QueryClientProvider client={queryClient}>
                    <WorkspaceContext.Provider value={workspace}>
                        <WorkspaceInitializer />
                        <Scaffold>
                            <Scaffold.ActivityBar>
                                <Scaffold.ActivityBar.Group>
                                    <Scaffold.ActivityBar.Item
                                        iconName='folder-outline'
                                        page='file-explorer'
                                    />
                                </Scaffold.ActivityBar.Group>
                                <Scaffold.ActivityBar.Item
                                    iconName='settings-outline'
                                    goTo='/settings'
                                />
                            </Scaffold.ActivityBar>
                            <Scaffold.SidePanel>
                                <Scaffold.SidePanel.Page name='file-explorer'>
                                    <FileExplorer />
                                </Scaffold.SidePanel.Page>
                            </Scaffold.SidePanel>
                            <Scaffold.Main>
                                <Stack
                                    screenOptions={{
                                        headerShown: false,
                                    }}
                                    initialRouteName='index'
                                />
                            </Scaffold.Main>
                        </Scaffold>
                    </WorkspaceContext.Provider>
                </QueryClientProvider>
            </trpc.Provider>

            <CodeKeyboard
                onDismiss={() => {
                    setIsKeyboardOpen(false);
                }}
                isVisble={isKeyboardOpen}
            />
        </KeyboardContext.Provider>
    );
}
