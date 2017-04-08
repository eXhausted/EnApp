import React from 'react';
import { View } from 'react-native';
import { observer, inject } from 'mobx-react/native';
import { Button, Container, Header, Tab, Tabs, Text, Title } from 'native-base';
import Icon from 'react-native-vector-icons/Entypo';

import API from '../util/API';
import Helper from '../util/helper';

import Colors from '../constants/colors';

import CountableText from '../core/components/CountableText';

import TaskSection from '../sections/TaskSection';
import SectorsSection from '../sections/SectorsSection';
import CodeSection from '../sections/CodeSection';


const mapStateToProps = (stores => ({
    globalTimerCounter: stores.gameStore.globalTimerCounter,
    lastUpdateTimestamp: stores.gameStore.lastUpdateTimestamp,
    Level: stores.gameStore.gameModel.Level,
    Levels: stores.gameStore.gameModel.Levels,
}));

const GameView = ({ globalTimerCounter, lastUpdateTimestamp, Level, Levels }) => (
    <Container>
        <Header style={styles.headerStyle} hasTabs>
            <View style={styles.timersContainer}>
                <CountableText
                  increment
                  start={(lastUpdateTimestamp - Helper.normalizeTime(Level.StartTime.Value)) / 1000}
                  textStyle={{ color: Colors.white }}
                />
                {
                    Level.Timeout > 0 &&
                        <CountableText
                          start={Level.TimeoutSecondsRemain}
                          textStyle={{ color: Colors.upTime }}
                        />
                }
            </View>
            <Title style={styles.levelNumber}>{`${Level.Number} из ${Levels.length}`}</Title>
            <Button
              onPress={API.loginUser}
              style={styles.menuButton}
              transparent
            >
                <Icon style={{ fontSize: 20, color: 'white' }} name="dots-three-vertical" />
            </Button>
        </Header>
        <Tabs locked>
            <Tab heading="ЗАДАНИЕ">
                <TaskSection />
            </Tab>
            <Tab heading={`СЕКТОРА (${Level.SectorsLeftToClose})`}>
                <SectorsSection />
            </Tab>
            <Tab heading="ПОДСКАЗКИ">
                <Text>Подсказки</Text>
            </Tab>
        </Tabs>
        <CodeSection />
    </Container>
);

const styles = {
    mainContainer: {
        backgroundColor: Colors.background,
        flex: 1,
        padding: 7,
    },

    headerStyle: {
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    timersContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    levelNumber: {
        flex: 1,
    },

    menuButton: {
        flex: 1,
        justifyContent: 'flex-end',
    },
};

export default inject(mapStateToProps)(observer(GameView));
