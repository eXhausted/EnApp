import React, {Component} from "react";
import {observer} from "mobx-react/native";
import {Button, Container, Header, Tab, Tabs, Text, Title} from "native-base";
import Icon from "react-native-vector-icons/Entypo";

import API from "../util/API";

import Colors from "../constants/colors";

import TaskSection from "../sections/TaskSection";
import SectorsSection from "../sections/SectorsSection";
import CodeSection from "../sections/CodeSection";

@observer
class GameView extends Component {
    render() {
        const { store } = this.props;
        const { gameModel } = store;
        const { Level } = gameModel;

        return (
            <Container>
                <Header style={{ justifyContent: 'space-between', alignItems: 'center' }} hasTabs>
                    <Text style={styles.upTime}>03:59:54</Text>
                    <Title style={{ flex: 1 }}>{`${Level.Number} из ${gameModel.Levels.length}`}</Title>
                    <Button
                      onPress={() => API.loginUser()} style={{ flex: 1, justifyContent: 'flex-end' }}
                      transparent
                    >
                        <Icon style={{ fontSize: 20, color: 'white' }} name="dots-three-vertical" />
                    </Button>
                </Header>
                <Tabs locked>
                    <Tab heading="ЗАДАНИЕ">
                        <TaskSection
                          levelName={Level.Name}
                          taskText={Level.Tasks[0].TaskText}
                          shouldReplaceNlToBr={Level.Tasks[0].ReplaceNlToBr}
                          isRefreshing={store.isRefreshing}
                          updateGameModel={store.updateGameModel}
                        />
                    </Tab>
                    <Tab heading={`СЕКТОРА (${Level.SectorsLeftToClose})`}>
                        <SectorsSection
                          sectors={Level.Sectors}
                          isRefreshing={store.isRefreshing}
                          updateGameModel={store.updateGameModel}
                        />
                    </Tab>
                    <Tab heading="ПОДСКАЗКИ">
                        <Text>Подсказки</Text>
                    </Tab>
                </Tabs>
                <CodeSection
                  actualCode={store.actualCode}
                  changeActualCode={store.changeActualCode}
                  oldCodes={Level.MixedActions}
                  sendCode={store.sendCode}
                />
            </Container>
        );
    }
}

const styles = {
    mainContainer: {
        backgroundColor: Colors.background,
        flex: 1,
        padding: 7,
    },

    upTime: {
        flex: 1,
        color: Colors.white,
    },
};

export default GameView;
