import React, { Component } from 'react';
import { View } from 'react-native';
import { observer, Provider } from 'mobx-react/native';
import gameStore from '../core/stores/gameStore';
import GameView from './GameView';
import LoadingView from './LoadingView';

class MainView extends Component {

    render() {
        const { gameModel } = gameStore;

        return (
            <Provider gameStore={gameStore}>
                {gameModel.Event === 0 ? <GameView /> : <LoadingView />}
            </Provider>
        );
    }
}

export default observer(MainView);
