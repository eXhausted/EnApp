import qs from 'querystring';
import axios from 'axios';


const ALIAS_NECTO68_MIRROR = 'app';

class API {
    static async getGameModal(requestData = {}) {
        let response = await axios({
            url: `http://necto68.url.ph/game/?g=${ALIAS_NECTO68_MIRROR}&json=1`,
            method: 'post',
            timeout: 12000,
            data: qs.stringify(requestData),
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
