export default function getLastWordFromCharPos(
    text: string,
    charPos: number
): string {
    const textUntilCharPos = text.slice(0, charPos);
    const words = textUntilCharPos.split(/[^\w]/);
    return words[words.length - 1];
}
