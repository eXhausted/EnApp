import { action, observable } from 'mobx';
import BackgroundTimer from 'react-native-background-timer';
import PushNotification from 'react-native-push-notification';

import API from '../../util/API';


class GameStore {
    @observable gameModel = {};
    @observable globalTimerCounter = 0;
    @observable isRefreshing = false;
    @observable actualCode = '';
    @observable lastUpdateTimestamp = Date.now();

    globalTimer = null;
    REFRESH_INTERVAL_SECONDS = 30;

    @action updateGameModel = async (requestData) => {
        if (this.isRefreshing) return;

        this.isRefreshing = true;

        try {
            this.gameModel = await API.getGameModal(requestData);
            this.isRefreshing = false;
        } catch (e) {
            this.isRefreshing = false;
            return;
        }

        this.lastUpdateTimestamp = Date.now();
        this.globalTimerCounter = 0;

        if (this.globalTimer) BackgroundTimer.clearInterval(this.globalTimer);

        this.globalTimer = BackgroundTimer.setInterval(() => {
            this.globalTimerCounter += 1;

            if (this.REFRESH_INTERVAL_SECONDS > 0 && this.globalTimerCounter % this.REFRESH_INTERVAL_SECONDS === 0) {
                this.updateGameModel();
            }
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
