import qs from 'querystring';
import axios from 'axios';

import asyncStorage from './asyncStorage';

class API {
    static async getGameModal(requestData = {}) {
        const storageValues = await asyncStorage.getItems([
            'domainValue',
            'idGameValue',
            'cookiesValue',
        ]);

        const {
            domainValue,
            idGameValue,
            cookiesValue,
        } = storageValues;

        if (!domainValue || !idGameValue) {
            return {};
        }

        let response = await axios({
            url: `http://${domainValue}/gameengines/encounter/play/${idGameValue}?json=1&lang=ru`,
            method: 'post',
            timeout: 12000,
            data: qs.stringify(requestData),
            withCredentials: true,
            maxRedirects: 0,
            headers: {
                // Cookie: cookiesValue,
                'User-Agent': 'EnApp by necto68',
            },
        });

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
            url: `http://${storageValues.domainValue}/login/signin?json=1&lang=ru`,
            method: 'post',
            data: {
                Login: storageValues.loginValue,
                Password: storageValues.passwordValue,
            },
            headers: {
                'User-Agent': 'EnApp by necto68',
            },
        });

        return response;
    }
}

export default API;
