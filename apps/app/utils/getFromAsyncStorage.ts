import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getFromAsyncStorage<T>(key: string): Promise<T | null> {
    const data = await AsyncStorage.getItem(key);
    if (!data) {
        return null;
    }
    return JSON.parse(data);
}
