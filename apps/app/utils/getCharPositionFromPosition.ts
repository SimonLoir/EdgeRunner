export default function getCharPositionFromPosition(
    str: string,
    position: { line: number; character: number }
) {
    let char = 0;
    const lines: string[] = str.split('\n');
    console.log('lines', lines);

    for (let i = 0; i < position.line; i++) {
        if (lines) char += lines[i]!.length + 1;
    }

    return char + position.character;
}
