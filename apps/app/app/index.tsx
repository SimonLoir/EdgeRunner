import React, { useEffect } from 'react';
import { TouchableOpacity, Text, View, Modal } from 'react-native';
import { trpc } from '../utils/api';
import { Link } from 'expo-router';

export default function App() {
    useEffect(() => {
        void (async () => {
            trpc.lsp.window.showMessage.subscribe(
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
