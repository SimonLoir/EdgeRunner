export default function getPositionFromCharPos(str: string, char: number) {
    const lines = str.split('\n');
    let line = 0;
    let col = 0;
    for (let i = 0; i < lines.length; i++) {
        if (char <= lines[i].length) {
            line = i;
            col = char;
            break;
        }
        char -= lines[i].length + 1;
    }
    return { line, col };
}
