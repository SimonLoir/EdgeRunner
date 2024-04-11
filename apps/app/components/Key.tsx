import { TouchableOpacity, Text } from 'react-native';

type KeyProps = {
    keyPressed: string;
    value: string | JSX.Element;
    onPress: (key: string) => void;
    keyHeight: number;
    keyMargin: number;
    keyWidth: number;
};

export default function Key({
    keyPressed,
    value,
    onPress,
    keyHeight,
    keyMargin,
    keyWidth,
}: KeyProps) {
    return (
        <TouchableOpacity
            className='bg-[rgb(30,30,30)]'
            style={{
                width: keyWidth,
                height: keyHeight,
                margin: keyMargin,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
            }}
            onPress={() => {
                onPress(keyPressed);
            }}
        >
            <Text className='text-white'>{value}</Text>
        </TouchableOpacity>
    );
}
