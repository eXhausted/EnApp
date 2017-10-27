import { action, observable } from 'mobx';
import BackgroundTimer from 'react-native-background-timer';
import onGlobalTimerTick from '../../core/events/onGlobalTimerTick';
import onNewLevelStart from '../../core/events/onNewLevelStart';

import globals from '../../constants/globals';

import API from '../../util/API';
import asyncStorage from '../../util/asyncStorage';
import Helper from '../../util/helper';


class GameStore {
    @observable gameModel = {};
    @observable globalTimerCounter = 0;
    @observable isRefreshing = false;
    @observable actualCode = '';
    @observable actualBonusCode = '';
    @observable lastUpdateTimestamp = Date.now();
    @observable actualView = 'LoadingView';
    @observable currentTabsPage = 0;
    @observable updatesQueue = [];

    globalTimer = null;

    @action updateGameModel = async (requestData = {}) => {
        let $uniqueId = 0;

        if (this.updatesQueue.length === 0 || !Helper.isObjectEmpty(requestData)) {
            $uniqueId = Helper.randomInt(100000, 999999);
            this.updatesQueue = this.updatesQueue.concat({ $uniqueId, ...requestData });
        }

        if (this.isRefreshing) return;

        const firstRequestData = this.updatesQueue[0];
        let gameModelBuffer = {};

        this.isRefreshing = true;

        try {
            gameModelBuffer = await API.getGameModal(firstRequestData);
            this.isRefreshing = false;
        } catch (e) {
            this.isRefreshing = false;
            return;
        }

        if (globals.GAME_MODAL_EVENTS_FOR_UPDATE.includes(gameModelBuffer.Event)) {
            this.updateGameModel();
        } else if (gameModelBuffer.Event === 0) {
            if (
                this.gameModel.Level &&
                gameModelBuffer.Level &&
                this.gameModel.Level.Number !== gameModelBuffer.Level.Number
            ) {
                this.gameModel = gameModelBuffer;
                onNewLevelStart();
            }

            this.gameModel = gameModelBuffer;
            this.onSuccessGetGameModel({ deleteUpdatesItemId: firstRequestData.$uniqueId });
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

    @action setCurrentTabsPage = (currentPage) => {
        this.currentTabsPage = currentPage;
    };

    @action signOut = () => {
        this.gameModel = {};
        this.actualView = 'LoginView';
        BackgroundTimer.clearInterval(this.globalTimer);
        asyncStorage.setItem('cookiesValue', '');
    };

    @action onSuccessGetGameModel = ({ deleteUpdatesItemId }) => {
        this.setActualView('GameView');

        this.lastUpdateTimestamp = Date.now();
        this.globalTimerCounter = 0;

        if (this.updatesQueue.length > 0) {
            // delete sent item
            this.updatesQueue = this.updatesQueue.filter(item => item.$uniqueId !== deleteUpdatesItemId);

            if (this.updatesQueue.length > 0) {
                // no timeout === ban for bruteforce
                setTimeout(() => {
                    this.updateGameModel(this.updatesQueue[0]);
                }, Helper.randomInt(200, 500));
            }
        }

        if (this.globalTimer) BackgroundTimer.clearInterval(this.globalTimer);

        this.globalTimer = BackgroundTimer.setInterval(() => {
            onGlobalTimerTick();
        }, 1000);
    }
}

export default new GameStore();
