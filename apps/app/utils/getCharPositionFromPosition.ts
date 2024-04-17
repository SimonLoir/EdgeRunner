export default function getCharPositionFromPosition(
    str: string,
    position: { line: number; character: number }
) {
    let char = 0;
    const lines = str.split('\n');

    for (let i = 0; i < position.line; i++) {
        char += lines[i].length + 1;
    }

    return char + position.character;
}
