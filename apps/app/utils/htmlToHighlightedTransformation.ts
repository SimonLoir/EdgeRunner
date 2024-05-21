export type Highlighted = {
    value: string;
    className: string | undefined;
};
export function transformHtmlToHighlighted(html: string): Highlighted[] {
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
        // If a new tag is found
        if (html.slice(i).startsWith(tagBegin)) {
            // If there was a value, push it to the result (value not between tags)
            if (value !== '') {
                result.push({
                    value: unescapeHtml(value),
                    className: undefined,
                });
                // Reset value
                value = '';
                className = '';
            }
            inClass = true;
            i += tagBegin.length;
        }
        // If we are inside a beginning tag and we are reading the class name
        else if (inClass) {
            while (!html.slice(i).startsWith('">')) {
                className += html[i];
                i++;
            }
            i += 2;
            inClass = false;
        }
        // If we encounter the ending tag
        else if (html.slice(i).startsWith(tagEnd)) {
            result.push({ value: unescapeHtml(value), className });
            value = '';
            className = '';
            i += tagEnd.length;
        }
        // If we are reading a value between tags or outside of tags
        else {
            value += html[i];
            i++;
        }
    }
    if (value !== '') {
        result.push({ value: unescapeHtml(value), className: undefined });
    }

    const tokensHighlighted: Highlighted[] = [];

    // Split all tokens to highlight them individually
    result.forEach((highlighted) => {
        tokensHighlighted.push(...splitTokensFromHighLighted(highlighted));
    });

    return tokensHighlighted;
}

function splitTokensFromHighLighted(highlighted: Highlighted): Highlighted[] {
    const regex = /\W/g;
    // Get all tokens that are not words
    const pattern = highlighted.value.match(regex);
    // Get all tokens that are words
    const tokens = highlighted.value.split(regex);

    const allTokensTemp = [];

    for (let i = 0; i < tokens.length; i++) {
        allTokensTemp.push(tokens[i]);
        if (i < tokens.length - 1) {
            allTokensTemp.push(pattern![i]);
        }
    }

    // Optimize the array by merging all spaces together
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

    // Get Highlighted tokens individually
    return allTokens.map((token) => ({
        value: token,
        className: highlighted.className,
    }));
}

function unescapeHtml(value: string): string {
    return value
        .replaceAll('&amp;', '&')
        .replaceAll('&lt;', '<')
        .replaceAll('&gt;', '>')
        .replaceAll('&quot;', '"')
        .replaceAll('&#x27;', "'");
}
