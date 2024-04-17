import unescapeHtml from './unescapeHtml';

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

    const tokensHighlighted: Highlighted[] = [];

    result.forEach((highlighted) => {
        tokensHighlighted.push(...splitTokensFromHighLighted(highlighted));
    });

    return tokensHighlighted;
}

function splitTokensFromHighLighted(highlighted: Highlighted): Highlighted[] {
    const regex = /\W/g;
    const pattern = highlighted.value.match(regex);
    const tokens = highlighted.value.split(regex);

    const allTokensTemp = [];

    for (let i = 0; i < tokens.length; i++) {
        allTokensTemp.push(tokens[i]);
        if (i < tokens.length - 1) {
            allTokensTemp.push(pattern![i]);
        }
    }

    const allTokens = [];
    let currentTokenValue: string = '';
    for (let i = 0; i < allTokensTemp.length; i++) {
        if (allTokensTemp[i] === ' ') {
            currentTokenValue += ' ';
        } else {
            if (allTokensTemp[i] === '') {
                continue;
            }
            if (currentTokenValue !== '') {
                allTokens.push(currentTokenValue);
                currentTokenValue = '';
            }

            allTokens.push(allTokensTemp[i]);
        }
    }

    if (currentTokenValue !== '') {
        allTokens.push(currentTokenValue);
    }

    return allTokens.map((token) => ({
        value: token,
        className: highlighted.className,
    }));
}
