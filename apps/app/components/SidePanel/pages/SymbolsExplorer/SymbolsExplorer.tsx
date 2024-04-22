import useSymbols from '../../../../utils/workspace/hooks/useSymbols';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import useWorkspace from '../../../../utils/workspace/hooks/useWorkspace';

export default function SymbolsExplorer() {
    const openedFilesSymbols = useSymbols();
    const workspace = useWorkspace();
    return (
        <FlatList
            data={openedFilesSymbols.filter(
                (file) => file.symbols && file.symbols.length > 0
            )}
            renderItem={({ item: fileItem }) => {
                const symbols: any[] = ((fileItem.symbols as any[]) ?? [])
                    .filter((s) => s.location?.range?.start)
                    .sort((a, b) => {
                        const aLoc = a.location?.range?.start;
                        const bLoc = b.location?.range?.start;
                        if (!aLoc || !bLoc) {
                            return 0;
                        }
                        return aLoc.line - bLoc.line;
                    });
                return (
                    <View className='mb-4'>
                        <Text
                            className='text-gray-300 font-bold mb-2 text-xl'
                            onPress={() => {
                                workspace.currentFile = fileItem.file;
                            }}
                        >
                            &gt; {fileItem.file}
                        </Text>
                        <FlatList
                            data={symbols}
                            className=''
                            renderItem={({ item }) => {
                                const location: {
                                    line: number;
                                    character: number;
                                } | null = item.location?.range?.start;
                                return (
                                    <TouchableOpacity
                                        className='py-1 pl-3 text-lg'
                                        onPress={() => {
                                            workspace.moveCursorTo(
                                                fileItem.file,
                                                location?.line ?? 0,
                                                location?.character ?? 0
                                            );
                                        }}
                                    >
                                        <Text className='text-white'>
                                            {item.name}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    </View>
                );
            }}
        />
    );
}
