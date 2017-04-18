import qs from 'querystring';
import axios from 'axios';

class API {
    static async getGameModal(requestData = {}) {
        let response = await axios({
            url: 'http://necto68.url.ph/game/?g=app&json=1',
            method: 'post',
            timeout: 10000,
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
            Password: '3av1415gor68_1',
        });
    }
}

export default API;
