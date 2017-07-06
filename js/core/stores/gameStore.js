import { action, observable } from 'mobx';
import BackgroundTimer from 'react-native-background-timer';
import onGlobalTimerTick from '../../core/events/onGlobalTimerTick';

import API from '../../util/API';
import asyncStorage from '../../util/asyncStorage';


class GameStore {
    @observable gameModel = {};
    @observable globalTimerCounter = 0;
    @observable isRefreshing = false;
    @observable actualCode = '';
    @observable lastUpdateTimestamp = Date.now();
    @observable actualView = 'LoadingView';

    globalTimer = null;

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

        if (this.gameModel.Event === 0) {
            this.onSuccessGetGameModel();
        } else if (Number.isInteger(this.gameModel.Event)) {
            this.setActualView('LoadingView');
        } else {
            this.setActualView('LoginView');
        }
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

    @action setActualView = (viewName) => {
        this.actualView = viewName;
    };

    @action signOut = () => {
        this.gameModel = {};
        this.actualView = 'LoginView';
        BackgroundTimer.clearInterval(this.globalTimer);
        asyncStorage.setItem('cookiesValue', '');
    };

    @action onSuccessGetGameModel = () => {
        this.setActualView('GameView');

        this.lastUpdateTimestamp = Date.now();
        this.globalTimerCounter = 0;

        if (this.globalTimer) BackgroundTimer.clearInterval(this.globalTimer);

        this.globalTimer = BackgroundTimer.setInterval(() => {
            onGlobalTimerTick();
        }, 1000);
    }
}

export default new GameStore();
