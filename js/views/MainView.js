import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { observer, Provider } from 'mobx-react/native';
import gameStore from '../core/stores/gameStore';
import GameView from './GameView';

@observer
class MainView extends Component {
    componentDidMount() {
        if (!gameStore.gameModel.Level) {
            gameStore.updateGameModel();
        }
    }
    render() {
        if (gameStore.gameModel.Level) {
            return (
                <Provider gameStore={gameStore}>
                    <GameView />
                </Provider>
            );
        }
        return <View><Text>Loading...</Text></View>;
    }
}

export default MainView;
