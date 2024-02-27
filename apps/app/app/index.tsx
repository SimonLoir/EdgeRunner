import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { trpc } from '../utils/api';
export default function App() {
    useEffect(() => {
        void trpc.test
            .query()
            .then((x) => {
                console.log(x);
            })
            .catch((e) => {
                console.error(e);
            });
    }, []);

    return (
        <View>
            <Text className='text-white'>Hello world</Text>
        </View>
    );
}
