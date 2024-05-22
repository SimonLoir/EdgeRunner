import { createContext, useContext } from 'react';
import { z } from 'zod';
import { completionItemSchema } from '@/schemas/exportedSchemas';

type KeyboardContextType = {
    isKeyboardOpen: boolean;
    setIsKeyboardOpen: (value: boolean) => void;
    keyboardItems: z.infer<typeof completionItemSchema>[];
    setKeyboardItems: (value: z.infer<typeof completionItemSchema>[]) => void;
    enableNativeKeyboard: boolean;
    setEnableNativeKeyboard: (value: boolean) => void;
};

export const KeyboardContext = createContext<KeyboardContextType | null>(null);

export const useKeyboardContext = () => {
    const context = useContext(KeyboardContext);
    if (context === null) {
        throw new Error(
            'useKeyboardContext must be used within a KeyboardContext.Provider'
        );
    }
    return context;
};
