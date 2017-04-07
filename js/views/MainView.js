import React, {Component} from "react";
import {Text, View} from "react-native";
import {observer} from "mobx-react/native";
import store from "../core/store";
import GameView from "./GameView";

@observer
class MainView extends Component {
    componentDidMount() {
        if (!store.gameModel.Level) {
            store.updateGameModel();
        }
    }
    render() {
        return (
            store.gameModel.Level ? <GameView store={store}/> : <View><Text>123123132132</Text></View>
        );
    }
}

export default MainView;
