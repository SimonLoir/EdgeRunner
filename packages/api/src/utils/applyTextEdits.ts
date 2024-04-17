import { z } from 'zod';
import { textEditSchema } from '@/schemas/exportedSchemas';

type TextEdit = z.infer<typeof textEditSchema>;

function convertPositionToIndex(
    position: { line: number; character: number },
    lines: string[]
): number {
    let index = 0;
    for (let i = 0; i < position.line; i++) {
        const line = lines[i];
        if (line === undefined) break;
        index += line.length + 1;
    }
    index += position.character;
    return index;
}

export function applyTextEdits(text: string, edits: TextEdit[]): string {
    const reversed = [...edits].reverse();
    const split = text.split(/\r?\n/g);

    for (const textEdit of reversed) {
        const start = convertPositionToIndex(textEdit.range.start, split);
        const end = convertPositionToIndex(textEdit.range.end, split);
        const before = text.slice(0, start);
        const after = text.slice(end);
        text = before + textEdit.newText + after;
    }

    return text;
}
