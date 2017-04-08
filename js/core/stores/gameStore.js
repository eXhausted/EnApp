import { action, observable } from 'mobx';
import BackgroundTimer from 'react-native-background-timer';

import API from '../../util/API';


class GameStore {
    @observable gameModel = {};
    @observable globalTimerCounter = 0;
    @observable isRefreshing = false;
    @observable actualCode = '';
    @observable lastUpdateTimestamp = Date.now();

    globalTimer = null;

    @action updateGameModel = async (requestData) => {
        if (this.isRefreshing) return;

        this.isRefreshing = true;
        this.gameModel = await API.getGameModal(requestData);
        this.isRefreshing = false;

        this.lastUpdateTimestamp = Date.now();

        if (this.globalTimer) BackgroundTimer.clearInterval(this.globalTimer);

        this.globalTimerCounter = 0;
        this.globalTimer = BackgroundTimer.setInterval(() => {
            this.globalTimerCounter += 1;
        }, 1000);
    };

    @action sendCode = async () => {
        const requestData = {
            LevelId: this.gameModel.Level && this.gameModel.Level.LevelId,
            LevelNumber: this.gameModel.Level && this.gameModel.Level.Number,
            'LevelAction.Answer': this.actualCode,
        };

        this.updateGameModel(requestData);
    };

    @action changeActualCode = (code) => {
        this.actualCode = code;
    };
}

export default new GameStore();
