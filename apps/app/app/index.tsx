import React, { useEffect } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { trpc } from '../utils/api';
import { Link, Stack } from 'expo-router';

export default function App() {
    useEffect(() => {
        void (async () => {
            await trpc.lsp.window.showMessage.subscribe(
                {
                    language: 'typescript',
                },
                {
                    onData: (data) => {
                        console.log('showMessage', data);
                    },
                    onError: (err) => {
                        console.error('showMessage', err);
                    },
                }
            );
        })();
    }, []);

    return (
        <View>
            <Stack.Screen options={{ title: 'Home' }} />
            <Link href={'projects'} asChild>
                <TouchableOpacity>
                    <Text className='text-white'>Open a Project</Text>
                </TouchableOpacity>
            </Link>
            <TouchableOpacity>
                <Text className='text-white'>New Project</Text>
            </TouchableOpacity>
        </View>
    );
}
