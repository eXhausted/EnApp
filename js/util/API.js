import qs from 'querystring';
import axios from 'axios';

import asyncStorage from './asyncStorage';


const ALIAS_NECTO68_MIRROR = 'app';

class API {
    static async getGameModal(requestData = {}) {
        const storageValues = await asyncStorage.getItems([
            'domainValue',
            'idGameValue',
            'cookiesValue',
        ]);

        let response = await axios({
            // url: `http://necto68.url.ph/game/?g=${ALIAS_NECTO68_MIRROR}&json=1`,
            url: `http://${storageValues.domainValue}/gameengines/encounter/play/${storageValues.idGameValue}?json=1`,
            method: 'post',
            timeout: 12000,
            data: qs.stringify(requestData),
            withCredentials: true,
            maxRedirects: 0,
            headers: {
                Cookie: storageValues.cookiesValue,
            },
        });

        console.log(response);

        response = response.data;

        return response;
    }

    static async loginUser() {
        const storageValues = await asyncStorage.getItems([
            'domainValue',
            'loginValue',
            'passwordValue',
        ]);

        const response = await axios({
            url: `http://${storageValues.domainValue}/login/signin?json=1`,
            method: 'post',
            data: {
                Login: storageValues.loginValue,
                Password: storageValues.passwordValue,
            },
        });

        return response;
    }
}

export default API;
