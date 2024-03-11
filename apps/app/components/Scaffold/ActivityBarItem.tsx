import { TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Material from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { PanelPage } from './context/ScaffoldContext';
import useScaffoldContext from './context/useScaffoldContext';

type ActivityBarItemProps = {
    IconType?: typeof Ionicons | typeof Material;
    iconName: string;
    goTo?: string;
    page?: PanelPage;
};
export default function ActivityBarItem({
    IconType = Ionicons,
    iconName,
    goTo,
    page,
}: ActivityBarItemProps) {
    const router = useRouter();
    const { setSidePanelPage, sidePanelPage, setSidePanelOpen } =
        useScaffoldContext();
    const onPress = () => {
        if (goTo) router.navigate(goTo);
        if (page) {
            if (sidePanelPage === page) {
                setSidePanelOpen((prev) => !prev);
            } else {
                setSidePanelOpen(true);
                setSidePanelPage(page);
            }
        }
    };
    return (
        <TouchableOpacity
            className='h-20 w-20 flex items-center justify-center'
            onPress={onPress}
        >
            <IconType name={iconName as any} size={40} color={'gray'} />
        </TouchableOpacity>
    );
}
