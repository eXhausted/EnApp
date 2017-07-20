import React, { Component } from 'react';
import { observer, Provider } from 'mobx-react/native';
import gameStore from '../core/stores/gameStore';

import GameView from './GameView';
import LoadingView from './LoadingView';
import LoginView from './LoginView';

const VIEWS = {
    GameView,
    LoadingView,
    LoginView,
};

class MainView extends Component {

    render() {
        const ActualView = VIEWS[gameStore.actualView];

        if (ActualView) {
            return (
                <Provider gameStore={gameStore}>
                    <ActualView />
                </Provider>
            );
        }

        gameStore.setActualView('LoadingView');
        return null;
    }
}

export default observer(MainView);
