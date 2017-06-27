import qs from 'querystring';
import axios from 'axios';


const ALIAS_NECTO68_MIRROR = 'app';

class API {
    static async getGameModal(requestData = {}) {
        let response = await axios({
            url: `http://necto68.url.ph/game/?g=${ALIAS_NECTO68_MIRROR}&json=1`,
            // url: 'http://demo.en.cx/gameengines/encounter/play/26273?json=1',
            method: 'post',
            timeout: 12000,
            data: qs.stringify(requestData),
            withCredentials: true,
            /* headers: {
                Cookie: 'GUID=6773fd25%2Dabbf%2D4a52%2D918f%2D5fd7d3e4d293; atoken=uid%3d159224%26iss%3d0%26iscd%3d1%26tkn%3d72c671ff978c7b896bc82b04ce12f85dc1fbf3c1; stoken=gihljd4utoa45yn5ycbnjrre;',
            }, */
        });

        response = response.data;

        if (response.charCodeAt(0) === 65279) {
            response = response.substr(1);
            response = JSON.parse(response);
        }

        return response;
    }

    static async loginUser() {
        const response = await axios.post('http://dp.en.cx/login/signin?json=1', {
            Login: 'necto68',
            Password: '*******',
        });
    }
}

export default API;
