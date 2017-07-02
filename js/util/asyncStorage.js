import { AsyncStorage } from 'react-native';

class asyncStorage {
    static setItem = async (key, value) => {
        AsyncStorage.setItem(key, value);
    };

    static getItem = async (key) => {
        const storageValue = await AsyncStorage.getItem(key);
        return storageValue;
    };

    static setItems = async (obj) => {
        AsyncStorage.multiSet(Object.entries(obj));
    };

    static getItems = async (keys) => {
        const storageValues = await AsyncStorage.multiGet(keys);
        const obj = {};

        storageValues.forEach((value) => {
            obj[value[0]] = value[1];
        });

        return obj;
    };
}

export default asyncStorage;
