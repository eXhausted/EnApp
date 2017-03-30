import moment from 'moment';

class Helper {
    static normalizeHTML(html, shouldReplaceNlToBr = true) {
        let normalizedHtml = html.replace(
            /(\d{2,3}[.,]\d{3,8})[\s.,]{1,3}(\d{2,3}[.,]\d{3,8})/gim,
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

    static isEqualCode(code1, code2) {
        return code1.toString().toLowerCase() === code2.toString().toLowerCase();
    }
}

export default Helper;
