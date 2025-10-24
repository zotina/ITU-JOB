import { useCallback, useState } from 'react';

export const useLocalStorage = <T>(key: string, initialValue: T | null = null) => {
    const [storedValue, setStoredValue] = useState<T | null>(() => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error reading ${key} from localStorage:`, error);
            return initialValue;
        }
    });

    const setValue = useCallback((value: T | ((val: T | null) => T | null)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            if (valueToStore === null || valueToStore === undefined) {
                localStorage.removeItem(key);
            } else {
                localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.error(`Error setting ${key} in localStorage:`, error);
        }
    }, [key, storedValue]);

    const removeValue = useCallback(() => {
        try {
            localStorage.removeItem(key);
            setStoredValue(null);
        } catch (error) {
            console.error(`Error removing ${key} from localStorage:`, error);
        }
    }, [key]);

    return [storedValue, setValue, removeValue] as const;
};