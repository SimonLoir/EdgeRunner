import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Link, Stack } from 'expo-router';

export default function App() {
    return (
        <View>
            <Stack.Screen options={{ title: 'Home' }} />
            <Link href={'projects'} asChild>
                <TouchableOpacity>
                    <Text className='text-white'>Open a Project</Text>
                </TouchableOpacity>
            </Link>
            <Link href={'newProjectModal'} asChild>
                <TouchableOpacity>
                    <Text className='text-white'>New Project</Text>
                </TouchableOpacity>
            </Link>
        </View>
    );
}
