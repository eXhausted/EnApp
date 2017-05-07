import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { observer, Provider } from 'mobx-react/native';
import gameStore from '../core/stores/gameStore';
import GameView from './GameView';

import PushNotification from 'react-native-push-notification';

@observer
class MainView extends Component {
    componentDidMount() {
        if (!gameStore.gameModel.Level) {
            gameStore.updateGameModel();
        }
    }
    render() {
        return do {
            if (gameStore.gameModel.Level) { <Provider gameStore={gameStore}><GameView /></Provider>; }
            else if (gameStore.gameModel) { <View><Text>{`Event: ${gameStore.gameModel.Event}`}</Text></View>; }
            else { <View><Text>Loading...</Text></View>; }
        };
    }
}

export default MainView;
