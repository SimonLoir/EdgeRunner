import useSymbols from '../../../../utils/workspace/hooks/useSymbols';
import { FlatList, Text, View } from 'react-native';

export default function SymbolsExplorer() {
    const openedFilesSymbols = useSymbols();
    return (
        <FlatList
            data={openedFilesSymbols.filter(
                (file) => file.symbols && file.symbols.length > 0
            )}
            renderItem={({ item }) => {
                const symbols: any[] = item.symbols ?? [];
                return (
                    <View className='mb-4'>
                        <Text className='text-gray-300 font-bold mb-2'>
                            &gt; {item.file}
                        </Text>
                        <FlatList
                            data={symbols}
                            renderItem={({ item }) => (
                                <Text className='text-white'>{item.name}</Text>
                            )}
                        />
                    </View>
                );
            }}
        />
    );
}
