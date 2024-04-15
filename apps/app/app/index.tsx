import { Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import '../global.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { links, trpc, trpcClient } from '../utils/api';
import { useState } from 'react';
import Scaffold from '../components/Scaffold';
import Workspace from '../utils/workspace/Workspace';
import WorkspaceContext from '../utils/workspace/WorkspaceContext';
import FileExplorer from '../components/SidePanel/pages/FileExplorer';
import WorkspaceInitializer from '../components/WorkspaceInitializer';
import CodeKeyboard from 'components/CodeKeyboard';
import SymbolsExplorer from '../components/SidePanel/pages/SymbolsExplorer';
import { z } from 'zod';
import { completionItemSchema } from '@/schemas/exportedSchemas';
import { KeyboardContext } from '../utils/keyboardContext';
import { StatusBar } from 'expo-status-bar';

const queryClient = new QueryClient();

export default function IndexPage() {
    const [trpcReactClient] = useState(() =>
        trpc.createClient({
            links,
        })
    );
    const [workspace] = useState(() => new Workspace(trpcClient));
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    const [enableNativeKeyboard, setEnableNativeKeyboard] = useState(false);
    const [keyboardItems, setKeyboardItems] = useState<
        z.infer<typeof completionItemSchema>[]
    >([]);

    return (
        <>
            <StatusBar style='light' backgroundColor='rgb(40,40,40)' />
            <GestureHandlerRootView style={{ flex: 1 }}>
                <KeyboardContext.Provider
                    value={{
                        isKeyboardOpen,
                        setIsKeyboardOpen,
                        keyboardItems,
                        setKeyboardItems,
                        enableNativeKeyboard,
                        setEnableNativeKeyboard,
                    }}
                >
                    <trpc.Provider
                        queryClient={queryClient}
                        client={trpcReactClient}
                    >
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
                                            <Scaffold.ActivityBar.Item
                                                iconName='folder-outline'
                                                page='symbols-explorer'
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
                                        <Scaffold.SidePanel.Page name='symbols-explorer'>
                                            <SymbolsExplorer />
                                        </Scaffold.SidePanel.Page>
                                    </Scaffold.SidePanel>
                                    <Scaffold.Main />
                                </Scaffold>
                            </WorkspaceContext.Provider>
                        </QueryClientProvider>
                    </trpc.Provider>

                    <CodeKeyboard
                        onDismiss={() => {
                            setIsKeyboardOpen(false);
                        }}
                        isVisble={isKeyboardOpen}
                        onOpen={() => {
                            setEnableNativeKeyboard(false);
                            setIsKeyboardOpen(true);
                        }}
                        isNativeKeyboardEnabled={enableNativeKeyboard}
                        keyBoardItems={keyboardItems}
                    />
                </KeyboardContext.Provider>
            </GestureHandlerRootView>
        </>
    );
}
