import React from 'react';
import { View, Text, KeyboardAvoidingView } from 'react-native';
import { observer, inject } from 'mobx-react/native';
import moment from 'moment';
import { Button, Container, Header, Tab, Tabs, Title, ScrollableTab, TabHeading, Icon, Badge, Right } from 'native-base';

import IconEntypo from 'react-native-vector-icons/Entypo';

import Helper from '../util/helper';

import Colors from '../constants/colors';

import CountableText from '../core/components/CountableText';

import TaskSection from '../sections/TaskSection';
import SectorsSection from '../sections/SectorsSection';
import HintsSection from '../sections/HintsSection';
import BonusesSection from '../sections/BonusesSection';
import CodeSection from '../sections/CodeSection';

import onSettingsButtonClick from '../core/events/onSettingsButtonClick';


const mapStateToProps = (stores => ({
    // globalTimerCounter: stores.gameStore.globalTimerCounter,
    lastUpdateTimestamp: stores.gameStore.lastUpdateTimestamp,
    currentTabsPage: stores.gameStore.currentTabsPage,
    setCurrentTabsPage: stores.gameStore.setCurrentTabsPage,
    Level: stores.gameStore.gameModel.Level,
    Levels: stores.gameStore.gameModel.Levels,
    Hints: stores.gameStore.gameModel.Level.Helps,
    Bonuses: stores.gameStore.gameModel.Level.Bonuses,
}));

const GameView = ({/* globalTimerCounter, */ lastUpdateTimestamp, currentTabsPage, setCurrentTabsPage, Level, Levels, Hints, Bonuses }) => (
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
                {
                    Level.TimeoutAward !== 0 &&
                    <Text
                        style={{ color: Colors.wrongCode }}
                    >
                        {`(${Helper.formatCount(Math.abs(Level.TimeoutAward), { collapse: true, withUnits: true })})`}
                    </Text>
                }
            </View>
            <Title style={styles.levelNumber}>{`${Level.Number} из ${Levels.length}`}</Title>
            <Right>
                <View style={styles.lastUpdateContainer}>
                    <Text
                        style={styles.lastUpdateTitle}
                    >
                        {'Обновлено'}
                    </Text>
                    <CountableText
                        increment
                        start={moment.duration(Date.now() - lastUpdateTimestamp).asSeconds()}
                        formatCountOptions={{ collapse: true, withUnits: true }}
                        textStyle={{ color: Colors.upTime }}
                    />
                    <Text
                        style={styles.lastUpdateTitle}
                    >
                        {'назад'}
                    </Text>
                </View>
                <Button
                    transparent
                    onPress={onSettingsButtonClick}
                    style={styles.menuButton}
                >
                    <IconEntypo style={{ fontSize: 20, color: 'white' }} name="dots-three-vertical" />
                </Button>
            </Right>
        </Header>
        <Tabs
            locked
            renderTabBar={() => <ScrollableTab backgroundColor={Colors.tabBackground} />}
            initialPage={0}
            page={currentTabsPage}
            onChangeTab={tabObject => setCurrentTabsPage(tabObject.i)}
            tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
            prerenderingSiblingsNumber={1}
        >
            <Tab
                heading={
                    Helper.formatWithNewLine([
                        'ЗАДАНИЕ',
                        Level.Messages.length > 0 ? `(${Level.Messages.length})` : '',
                    ])
                }
                textStyle={styles.tabText}
                activeTextStyle={styles.tabText}
                tabStyle={styles.tabStyle}
                activeTabStyle={styles.tabStyle}
            >
                <TaskSection />
            </Tab>
            {
                Level.SectorsLeftToClose > 0 &&
                <Tab
                    heading={Helper.formatWithNewLine([
                        'СЕКТОРЫ',
                        `(${Level.SectorsLeftToClose})`,
                    ])}
                    textStyle={styles.tabText}
                    activeTextStyle={styles.tabText}
                    tabStyle={styles.tabStyle}
                    activeTabStyle={styles.tabStyle}
                >
                    <SectorsSection />
                </Tab>
            }
            {
                Hints.length > 0 &&
                <Tab
                    heading={
                        Helper.formatWithNewLine([
                            'ПОДСКАЗКИ',
                            Hints.find(hint => hint.RemainSeconds > 0) ?
                                [
                                    '(',
                                    Hints.find(hint => hint.RemainSeconds > 0).Number - 1,
                                    '/',
                                    Hints.length,
                                    // ' - ',
                                    // Helper.formatCount(Hints.find(hint => hint.RemainSeconds > 0).RemainSeconds - globalTimerCounter),
                                    ')',
                                ].join('')
                                : `(${Hints.length}/${Hints.length})`,
                        ])
                    }
                    textStyle={styles.tabText}
                    activeTextStyle={styles.tabText}
                    tabStyle={styles.tabStyle}
                    activeTabStyle={styles.tabStyle}
                >
                    <HintsSection />
                </Tab>
            }
            {
                Bonuses.length > 0 &&
                <Tab
                    heading={
                        Helper.formatWithNewLine([
                            'БОНУСЫ',
                            `(${Bonuses.filter(bonus => bonus.IsAnswered).length}/${Bonuses.length})`,
                        ])
                    }
                    textStyle={styles.tabText}
                    activeTextStyle={styles.tabText}
                    tabStyle={styles.tabStyle}
                    activeTabStyle={styles.tabStyle}
                >
                    <BonusesSection />
                </Tab>
            }
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
        backgroundColor: Colors.tabBackground,
    },

    timersContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    levelNumber: {
        flex: 1,
        color: Colors.white,
    },

    menuButton: {
        // flex: 1,
        // justifyContent: 'flex-end',
    },

    tabIcon: {
        fontSize: 30,
        color: Colors.white,
    },

    tabBadge: {
        transform: [{
            scale: 0.8,
        }],
    },

    tabText: {
        textAlign: 'center',
        fontSize: 14,
        color: Colors.white,
    },

    tabBarUnderlineStyle: {
        backgroundColor: Colors.white,
    },

    tabStyle: {
        backgroundColor: Colors.tabBackground,
    },

    lastUpdateContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },

    lastUpdateTitle: {
        color: Colors.white,
        fontSize: 12
        ,
    },
};

export default inject(mapStateToProps)(observer(GameView));
