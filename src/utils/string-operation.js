export const addEllipsis = (text, max, isPrefix) => {

    if (!text) {
        return '';
    }

    if (text.toString().length < max) {
        return text;
    }

    if (isPrefix) {
        text = '...' + text.toString().substring(text.length - max, text.length);
    } else {
        text = text.toString().substring(0, max - 2) + '...'
    }

    return text;

}
