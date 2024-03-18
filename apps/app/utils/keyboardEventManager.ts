import { useState } from 'react';

export default class KeyboardEventManager {
    private static keyDownCallback?: (key: string) => void;

    constructor() {
        KeyboardEventManager.keyDownCallback = undefined;
    }
    static updateKeyDownCallback(callback: (key: string) => void) {
        KeyboardEventManager.keyDownCallback = callback;
    }

    static removeKeyDownCallback = () => {
        KeyboardEventManager.keyDownCallback = undefined;
    };
    static emitKeyDown = (key: string) => {
        if (KeyboardEventManager.keyDownCallback !== undefined) {
            KeyboardEventManager.keyDownCallback(key);
        }
    };
}
