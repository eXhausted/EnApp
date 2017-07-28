import { action, observable } from 'mobx';
import BackgroundTimer from 'react-native-background-timer';
import onGlobalTimerTick from '../../core/events/onGlobalTimerTick';

import globals from '../../constants/globals';

import API from '../../util/API';
import asyncStorage from '../../util/asyncStorage';


class GameStore {
    @observable gameModel = {};
    @observable globalTimerCounter = 0;
    @observable isRefreshing = false;
    @observable actualCode = '';
    @observable actualBonusCode = '';
    @observable lastUpdateTimestamp = Date.now();
    @observable actualView = 'LoadingView';

    globalTimer = null;

    @action updateGameModel = async (requestData) => {
        if (this.isRefreshing) return;

        let gameModelBuffer = {};

        this.isRefreshing = true;

        try {
            gameModelBuffer = await API.getGameModal(requestData);
            this.isRefreshing = false;
        } catch (e) {
            this.isRefreshing = false;
            return;
        }

        if (globals.GAME_MODAL_EVENTS_FOR_UPDATE.includes(gameModelBuffer.Event)) {
            this.updateGameModel();
        } else if (gameModelBuffer.Event === 0) {
            this.gameModel = gameModelBuffer;
            this.onSuccessGetGameModel();
        } else if (Number.isInteger(gameModelBuffer.Event)) {
            this.setActualView('LoadingView');
            this.gameModel = gameModelBuffer;
        } else {
            this.setActualView('LoginView');
            this.gameModel = {};
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

    @action sendBonusCode = async () => {
        const requestData = {
            LevelId: this.gameModel.Level && this.gameModel.Level.LevelId,
            LevelNumber: this.gameModel.Level && this.gameModel.Level.Number,
            'BonusAction.Answer': this.actualBonusCode,
        };

        this.updateGameModel(requestData);
    };

    @action changeActualCode = (code) => {
        this.actualCode = code;
    };

    @action changeActualBonusCode = (code) => {
        this.actualBonusCode = code;
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
