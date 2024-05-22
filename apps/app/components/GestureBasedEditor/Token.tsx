import { Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import 'highlight.js/styles/panda-syntax-dark.css';

type TokenProps = {
    onRename: () => void;
    value: string;
    className: string;
};

export default function Token({ onRename, value, className }: TokenProps) {
    const doubleTap = Gesture.Tap()
        .numberOfTaps(2)
        .onEnd(() => {
            runOnJS(onRename)();
        });

    if (value === '\n') {
        return (
            <View>
                <Text></Text>
            </View>
        );
    }

    return (
        <GestureDetector gesture={doubleTap}>
            <View>
                <Text className={className}>{value}</Text>
            </View>
        </GestureDetector>
    );
}
