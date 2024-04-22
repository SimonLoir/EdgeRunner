import { Text, TextInput, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

type TokenProps = {
    onRename: () => void;
    value: string;
    className: string | undefined;
};

export default function Token({ onRename, value, className }: TokenProps) {
    const doubleTap = Gesture.Tap()
        .numberOfTaps(2)
        .onEnd(() => {
            runOnJS(onRename)();
        });

    if (value === '\n') {
        return <></>;
    }

    return (
        <GestureDetector gesture={doubleTap}>
            <View>
                <Text className={className ?? 'text-white'}>{value}</Text>
            </View>
        </GestureDetector>
    );
}
