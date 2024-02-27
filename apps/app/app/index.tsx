import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { trpc } from '../utils/api';
export default function App() {
    useEffect(() => {
        void (async () => {
            await trpc.lsp.hover.query({
                language: 'typescript',
                options: {
                    position: {
                        character: 1,
                        line: 1,
                    },
                    textDocument: {
                        uri: 'test',
                    },
                },
            });
        })();
    }, []);

    return (
        <View>
            <Text className='text-white'>Hello world</Text>
        </View>
    );
}
