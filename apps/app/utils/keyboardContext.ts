import { createContext } from 'react';
import { z } from 'zod';
import { completionItemSchema } from '@/schemas/exportedSchemas';

export const KeyboardContext = createContext({
    isKeyboardOpen: false,
    setIsKeyboardOpen: (value: boolean) => {},
    keyboardItems: [] as z.infer<typeof completionItemSchema>[],
    setKeyboardItems: (value: z.infer<typeof completionItemSchema>[]) => {},
});
