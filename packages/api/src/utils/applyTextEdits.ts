import { TextEdit } from '@/schemas/models';

function getCharPositionFromPosition(
    str: string,
    position: { line: number; character: number }
) {
    let char = 0;
    const lines: string[] = str.split('\n');

    for (let i = 0; i < position.line; i++) {
        const line = lines[i];
        if (line) char += line.length + 1;
    }

    return char + position.character;
}

export function applyTextEdits(text: string, edits: TextEdit[]): string {
    const reversed = [...edits];

    for (const textEdit of reversed) {
        const start = getCharPositionFromPosition(text, textEdit.range.start);
        const end = getCharPositionFromPosition(text, textEdit.range.end);
        const before = text.slice(0, start);
        const after = text.slice(end);
        text = before + textEdit.newText + after;
    }

    return text;
}
