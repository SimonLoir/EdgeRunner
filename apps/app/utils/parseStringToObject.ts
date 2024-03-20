import unescapeHtml from "./unescapeHtml";

export type Highlighted = {
    value: string;
    className: string | undefined;
};
export function parseStringToObject(html: string): Highlighted[] {
    const result: {
        value: string;
        className: string | undefined;
    }[] = [];

    let i = 0;
    let value = '';
    let className = '';
    let inClass = false;
    const tagBegin = '<span class="';
    const tagEnd = '</span>';
    while (i < html.length) {
        if (html.slice(i).startsWith(tagBegin)) {
            if (value !== '') {
                result.push({
                    value: unescapeHtml(value),
                    className: undefined,
                });
                value = '';
                className = '';
            }
            inClass = true;
            i += tagBegin.length;
        } else if (inClass) {
            while (!html.slice(i).startsWith('">')) {
                className += html[i];
                i++;
            }
            i += 2;
            inClass = false;
        } else if (html.slice(i).startsWith(tagEnd)) {
            result.push({ value: unescapeHtml(value), className });
            value = '';
            className = '';
            i += tagEnd.length;
        } else {
            value += html[i];
            i++;
        }
    }
    if (value !== '') {
        result.push({ value: unescapeHtml(value), className: undefined });
    }

    return result;
}
