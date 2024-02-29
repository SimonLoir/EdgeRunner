import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { trpc } from '../utils/api';
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
                }
            );
        })();
    }, []);

    return (
        <View>
            <Text className='text-white'>Hello world</Text>
        </View>
    );
}
