import useFilesOpened from './useFilesOpened';
import { useQuery } from '@tanstack/react-query';
import useWorkspace from './useWorkspace';

/**
 * Hook that returns the list of symbols for the files opened in the workspace
 */
export default function useSymbols() {
    const files = useFilesOpened();
    const workspace = useWorkspace();
    const { data } = useQuery({
        queryKey: ['symbols', ...files],
        queryFn: () => {
            return Promise.all(
                files.map(async (file) => {
                    return {
                        file,
                        symbols: await workspace.getSymbolsForFile(file),
                    };
                })
            );
        },
    });
    return data ?? [];
}
