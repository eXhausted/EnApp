import {action, autorun, computed, observable} from "mobx";
import API from "../util/API";

class Store {
    @observable
    gameModel = {};

    @observable
    isRefreshing = false;

    @observable
    actualCode = '';

    @action
    updateGameModel = async () => {
        this.isRefreshing = true;
        this.gameModel = await API.getGameModal();
        this.isRefreshing = false;
    };

    @action
    sendCode = async () => {
        const requestData = {
            'LevelId': this.gameModel.Level && this.gameModel.Level.LevelId,
            'LevelNumber': this.gameModel.Level && this.gameModel.Level.Number,
            'LevelAction.Answer': this.actualCode,
        };

        this.isRefreshing = true;
        this.gameModel = await API.getGameModal(requestData);
        this.isRefreshing = false;
    };

    @action
    changeActualCode = (code) => {
        this.actualCode = code;
    }

}

export default new Store();
