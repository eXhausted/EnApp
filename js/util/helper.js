import moment from 'moment';
import {
    CustomTabs,
    ANIMATIONS_SLIDE,
    ANIMATIONS_FADE,
} from 'react-native-custom-tabs';
import asyncStorage from './asyncStorage';
import Colors from '../constants/colors';

class Helper {
    static normalizeHTML(html, shouldReplaceNlToBr = true) {
        let normalizedHtml = html.replace(
            /(?![^<]*>)(-?\d{2,3}[.,]\d{3,8})[\s.,]{1,3}(-?\d{2,3}[.,]\d{3,8})/gim,
            '<a href="geo:$1,$2?q=$1,$2">$&</a>',
        );
        normalizedHtml = normalizedHtml.replace(/\r\n/gim, shouldReplaceNlToBr ? '<br/>' : ' ');
        // hack for fucking strange decodeUri before set innerHTML. see in defaultHTML.html
        normalizedHtml = normalizedHtml.replace(/%/gim, 'HACK_WITH_PERCENTAGE_FOR_NOT_DECODE_URI_BEFORE_WEBVIEW');
        return normalizedHtml;
    }

    static normalizeTime(time) {
        return time - 62135596800000;
    }

    static formatTime(time) {
        return moment(Helper.normalizeTime(time)).format('HH:mm:ss');
    }

    static formatCount(s, options = {}) {
        const { collapse, withUnits } = options;
        const pad = num => (`0${num}`).slice(-2);
        let seconds = s;

        let minutes = Math.floor(seconds / 60);
        seconds %= 60;
        const hours = Math.floor(minutes / 60);
        minutes %= 60;

        if (collapse) {
            return [
                hours > 0 ? hours : '',
                do {
                    // eslint-disable-next-line
                    if (hours > 0) { withUnits ? ' ч ' : ':' } else { '' }
                },
                minutes > 0 ? minutes : '',
                do {
                    // eslint-disable-next-line
                    if (minutes > 0) { withUnits ? ' м ' : ':' } else { '' }
                },
                seconds > 0 ? seconds : '',
                do {
                    // eslint-disable-next-line
                    if (seconds > 0) { withUnits ? ' с ' : ':' } else { '' }
                },
            ].join('').trim();
        }

        return [
            hours,
            withUnits ? ' ч ' : ':',
            pad(minutes),
            withUnits ? ' м ' : ':',
            pad(seconds),
            withUnits ? ' с ' : '',
        ].join('').trim();
    }

    static isEqualCode(code1, code2) {
        const normalizeCode = code => code.toString().toLowerCase().trim();

        return normalizeCode(code1) === normalizeCode(code2);
    }

    static formatWithNewLine(stringArray) {
        return stringArray.join('\n').trim();
    }

    static async openCustomTab(url) {
        const cookiesValue = await asyncStorage.getItem('cookiesValue');

        CustomTabs.openURL(url, {
            toolbarColor: Colors.tabBackground,
            enableUrlBarHiding: true,
            showPageTitle: true,
            enableDefaultShare: true,
            animations: ANIMATIONS_SLIDE,
            headers: {
                Cookie: cookiesValue,
            },
        });
    }
}

export default Helper;
