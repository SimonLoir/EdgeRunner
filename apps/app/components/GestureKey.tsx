import { View, Text } from 'react-native';
import {
    Directions,
    Gesture,
    GestureDetector,
    gestureHandlerRootHOC,
} from 'react-native-gesture-handler';
import { runOnJS, useSharedValue } from 'react-native-reanimated';

type GestureKeyProps = {
    keys: Map<string, string | React.JSX.Element>;
    onPress: (key: string) => void;
    keyWidth: number;
    keyMargin: number;
};

const GestureKey = gestureHandlerRootHOC(function GestureKey({
    keys,
    onPress,
    keyWidth,
    keyMargin,
}: GestureKeyProps) {
    if (keys.size !== 5) {
        return null;
    }

    const initPosition = useSharedValue<{ x: number; y: number } | null>(null);
    const finalPosition = useSharedValue<{ x: number; y: number } | null>(null);
    const selectedPosition = useSharedValue<string>('C');

    const height = keyWidth;
    const sensibillity = 20;

    const position = ['C', 'N', 'E', 'S', 'W'];

    const square = [
        Array.from(keys.values()).slice(1, 2),
        Array.from(keys.values())
            .slice(4, 5)
            .concat(Array.from(keys.values()).slice(0, 1))
            .concat(Array.from(keys.values()).slice(2, 3)),
        Array.from(keys.values()).slice(3, 4),
    ];

    const squareKeys = Array.from(keys.keys());

    const fling = Gesture.Fling()
        .direction(
            Directions.UP | Directions.DOWN | Directions.LEFT | Directions.RIGHT
        )
        .onBegin((event) => {
            initPosition.value = { x: event.x, y: event.y };
            finalPosition.value = null;
        })
        .onFinalize((event) => {
            finalPosition.value = { x: event.x, y: event.y };

            if (initPosition.value && finalPosition.value) {
                const dx = finalPosition.value.x - initPosition.value.x;
                const dy = finalPosition.value.y - initPosition.value.y;

                if (
                    Math.abs(dx) < sensibillity &&
                    Math.abs(dy) < sensibillity
                ) {
                    selectedPosition.value = 'C';
                } else if (Math.abs(dx) > Math.abs(dy)) {
                    selectedPosition.value = dx > 0 ? 'E' : 'W';
                } else {
                    selectedPosition.value = dy > 0 ? 'S' : 'N';
                }

                const index = position.indexOf(selectedPosition.value);

                runOnJS(onPress)(squareKeys[index]);
            }
        });

    return (
        <GestureDetector gesture={fling}>
            <View
                className=' bg-[rgb(30,30,30)] items-center flex-col'
                style={{
                    width: keyWidth,
                    height: height,
                    margin: keyMargin,
                    borderRadius: 15,
                }}
            >
                {square.map((row, rowIndex) => {
                    return (
                        <View className='flex-row' key={rowIndex}>
                            {row.map((key, keyIndex) => {
                                return (
                                    <View
                                        className='items-center justify-center '
                                        style={{
                                            width: keyWidth / 3,
                                            height: keyWidth / 3,
                                            borderRadius: 15,
                                        }}
                                        key={keyIndex.toString() + key}
                                    >
                                        {rowIndex === 1 && keyIndex === 1 ? (
                                            <View
                                                style={{
                                                    width: keyWidth / 3,
                                                    height: keyWidth / 3,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Text
                                                    className=' align-middle text-white'
                                                    style={{
                                                        fontSize: keyWidth / 4,
                                                    }}
                                                >
                                                    {key}
                                                </Text>
                                            </View>
                                        ) : (
                                            <View
                                                style={{
                                                    width: keyWidth / 3,
                                                    height: keyWidth / 3,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Text
                                                    className='text-white'
                                                    style={{
                                                        fontSize: keyWidth / 6,
                                                    }}
                                                >
                                                    {key}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                );
                            })}
                        </View>
                    );
                })}
            </View>
        </GestureDetector>
    );
});

export default GestureKey;
