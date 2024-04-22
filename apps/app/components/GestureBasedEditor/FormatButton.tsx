import { FontAwesome5 } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { WorkspaceFile } from '../../utils/workspace/Workspace';
import { trpcClient } from '../../utils/api';
// @ts-ignore Can't find type declaration for module 'react-native-path'
import path from 'react-native-path';
import useWorkspace from '../../utils/workspace/hooks/useWorkspace';

export default function FormatButton({ file }: { file: WorkspaceFile }) {
    const workspace = useWorkspace();
    return (
        <TouchableOpacity
            className='absolute top-2 right-2 size-10 rounded-full items-center justify-center bg-[rgb(50,50,50)]'
            onPress={async () => {
                const d = await trpcClient.lsp.textDocument.formatting.query({
                    language: 'typescript',
                    workspaceID: workspace.id,
                    options: {
                        textDocument: {
                            uri:
                                'file://' +
                                path.resolve(await workspace.dir(), file),
                        },
                        options: {
                            insertFinalNewline: true,
                            tabSize: 4,
                            insertSpaces: true,
                            trimFinalNewlines: true,
                            trimTrailingWhitespace: true,
                        },
                    },
                });
                workspace.notifyContentChange(file, d);
            }}
        >
            <FontAwesome5
                name='paint-roller'
                size={16}
                color='rgb(170,170,170)'
            />
        </TouchableOpacity>
    );
}
