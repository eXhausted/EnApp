import moment from 'moment';

class Helper {
    static normalizeHTML(html, shouldReplaceNlToBr = true) {
        let normalizedHtml = html.replace(
            /(?![^<]*>)(-?\d{2,3}[.,]\d{3,8})[\s.,]{1,3}(-?\d{2,3}[.,]\d{3,8})/gim,
            '<a href="geo:$1,$2?q=$1,$2">$&</a>',
        );
        normalizedHtml = normalizedHtml.replace(/\r\n/gim, shouldReplaceNlToBr ? '<br/>' : ' ');
        return normalizedHtml;
    }

    static normalizeTime(time) {
        return time - 62135596800000;
    }

    static formatTime(time) {
        return moment(Helper.normalizeTime(time)).format('HH:mm:ss');
    }

    static formatCount(s) {
        const pad = num => (`0${num}`).slice(-2);
        let seconds = s;

        let minutes = Math.floor(seconds / 60);
        seconds %= 60;
        const hours = Math.floor(minutes / 60);
        minutes %= 60;
        // return `${hours <= 9 ? hours : '9+'}:${pad(minutes)}:${pad(seconds)}`;
        return `${hours}:${pad(minutes)}:${pad(seconds)}`;
    }

    static isEqualCode(code1, code2) {
        const normalizeCode = code => code.toString().toLowerCase().trim();

        return normalizeCode(code1) === normalizeCode(code2);
    }

    static formatWithNewLine(stringArray) {
        return stringArray.join('\n');
    }
}

export default Helper;
