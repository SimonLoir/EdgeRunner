import { ScrollView, Text } from 'react-native';
import React from 'react';
import { Highlighted } from '../../utils/parseStringToObject';

export default function GestureBasedEditor({
    fileContent,
    displayContent,
}: {
    fileContent?: string;
    displayContent?: Highlighted[];
}) {
    return (
        <>
            <ScrollView className='flex-1'>
                <Text className='text-white p-0 m-0'>
                    {displayContent === undefined ? (
                        <Text className={'text-white'}>{fileContent}</Text>
                    ) : (
                        displayContent.map((part, index) => {
                            return (
                                <Text
                                    key={index}
                                    className={part.className}
                                    onPress={() => {
                                        console.info('hello world');
                                    }}
                                >
                                    {part.value}
                                </Text>
                            );
                        })
                    )}
                </Text>
            </ScrollView>
        </>
    );
}
