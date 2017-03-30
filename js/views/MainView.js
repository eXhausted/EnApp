import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import store from '../core/store';
import GameView from './GameView';

@observer
class MainView extends Component {
    componentDidMount() {
        if (!store.gameModel.Level) {
            store.updateGameModel();
        }
    }
    render() {
        return (
            store.gameModel.Level ? <GameView store={store} /> : null
        );
    }
}

export default MainView;
