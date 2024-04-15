import useEditMode from '../utils/workspace/hooks/useEditMode';
import { FontAwesome5 } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import useWorkspace from '../utils/workspace/hooks/useWorkspace';

export default function EditModeSwitcher() {
    const workspace = useWorkspace();
    const editMode = useEditMode();
    return (
        <TouchableOpacity
            className='absolute bottom-2 right-2 size-14 rounded-full items-center justify-center bg-[rgb(50,50,50)]'
            onPress={() => {
                if (editMode === 'text') {
                    workspace.editMode = 'refactor';
                } else {
                    workspace.editMode = 'text';
                }
            }}
        >
            {editMode === 'text' ? (
                <FontAwesome5
                    name='pencil-alt'
                    size={24}
                    color='rgb(170,170,170)'
                />
            ) : (
                <FontAwesome5
                    name='pencil-ruler'
                    size={24}
                    color='rgb(170,170,170)'
                />
            )}
        </TouchableOpacity>
    );
}
