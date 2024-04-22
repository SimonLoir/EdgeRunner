export default class KeyboardEventManager {
    private static keyDownCallback?: (key: string) => void;
    private static completionItemDownCallback?: (item: string) => void;

    constructor() {
        KeyboardEventManager.keyDownCallback = undefined;
        KeyboardEventManager.completionItemDownCallback = undefined;
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

    static updateCompletionItemDownCallback(callback: (item: string) => void) {
        KeyboardEventManager.completionItemDownCallback = callback;
    }

    static removeCompletionItemDownCallback = () => {
        KeyboardEventManager.completionItemDownCallback = undefined;
    };

    static emitCompletionItemDown = (item: string) => {
        if (KeyboardEventManager.completionItemDownCallback !== undefined) {
            KeyboardEventManager.completionItemDownCallback(item);
        }
    };
}
