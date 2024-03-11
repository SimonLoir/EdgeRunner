import '../global.css';
import { Stack } from 'expo-router';
import { Platform, StatusBar, StyleSheet, Text } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { links, trpc } from '../utils/api';
import { useState } from 'react';
import Scaffold from '../components/Scaffold';
const queryClient = new QueryClient();

export default function Layout() {
    const [trpcReactClient] = useState(() =>
        trpc.createClient({
            links,
        })
    );
    return (
        <trpc.Provider queryClient={queryClient} client={trpcReactClient}>
            <QueryClientProvider client={queryClient}>
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
                        <Text>Hello world</Text>
                    </Scaffold.SidePanel>
                    <Scaffold.Main>
                        <Stack
                            screenOptions={{
                                contentStyle: {
                                    ...safeAreaStyle.AndroidSafeArea,
                                    backgroundColor: 'rgb(30 41 59)',
                                    padding: 20,
                                },
                                headerStyle: {
                                    backgroundColor: 'rgb(15 23 42)',
                                },
                                headerTitleStyle: {
                                    color: 'white',
                                },
                                headerTintColor: 'white',

                                statusBarTranslucent: true,
                                animation: 'ios',
                            }}
                            initialRouteName='index'
                        />
                    </Scaffold.Main>
                </Scaffold>
            </QueryClientProvider>
        </trpc.Provider>
    );
}

const safeAreaStyle = StyleSheet.create({
    AndroidSafeArea: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
});
