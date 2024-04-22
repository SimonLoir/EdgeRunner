export default function getCharPositionFromPosition(
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
