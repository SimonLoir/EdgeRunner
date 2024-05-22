import { TextEdit } from '@/schemas/models';

/**
 * Gets the character position (number) from a position object (line number and character).
 * @param str
 * @param position
 * @returns The character position.
 */
function getCharPositionFromPosition(
    str: string,
    position: { line: number; character: number }
) {
    let char = 0;
    const lines: string[] = str.split('\n');

    for (let i = 0; i < position.line; i++) {
        const line = lines[i];
        if (line !== undefined) char += line.length + 1;
    }

    return char + position.character;
}

/**
 * Applies a list of text edits to a string.
 * @param text The original text.
 * @param edits The list of text edits.
 * @returns The text with the edits applied.
 */
export function applyTextEdits(text: string, edits: TextEdit[]): string {
    const reversed = [...edits].reverse();

    for (const textEdit of reversed) {
        const start = getCharPositionFromPosition(text, textEdit.range.start);
        const end = getCharPositionFromPosition(text, textEdit.range.end);
        const before = text.slice(0, start);
        const after = text.slice(end);
        text = before + textEdit.newText + after;
    }

    return text;
}
