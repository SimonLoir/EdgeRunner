import { View } from 'react-native';
import useScaffoldContext from './context/useScaffoldContext';

export default function SidePanel({
    children = null,
}: {
    children?: React.ReactNode;
}) {
    const { sidePanelOpen } = useScaffoldContext();
    if (!sidePanelOpen) return <></>;
    return <View className='w-72'>{children}</View>;
}
