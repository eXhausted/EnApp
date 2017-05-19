import React from 'react';
import { View } from 'react-native';
import { observer, inject } from 'mobx-react/native';
import { Button, Container, Header, Tab, Tabs, Text, Title, ScrollableTab, TabHeading, Icon, Badge } from 'native-base';

import IconEntypo from 'react-native-vector-icons/Entypo';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';

import API from '../util/API';
import Helper from '../util/helper';

import PushNotification from 'react-native-push-notification';

import Colors from '../constants/colors';

import CountableText from '../core/components/CountableText';

import TaskSection from '../sections/TaskSection';
import SectorsSection from '../sections/SectorsSection';
import HintsSection from '../sections/HintsSection';
import CodeSection from '../sections/CodeSection';


const mapStateToProps = (stores => ({
    globalTimerCounter: stores.gameStore.globalTimerCounter,
    lastUpdateTimestamp: stores.gameStore.lastUpdateTimestamp,
    Level: stores.gameStore.gameModel.Level,
    Levels: stores.gameStore.gameModel.Levels,
    Hints: stores.gameStore.gameModel.Level.Helps,
}));

const GameView = ({ globalTimerCounter, lastUpdateTimestamp, Level, Levels, Hints }) => (
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
              transparent
              onPress={() => {
                  PushNotification.localNotification({
                      id: '0',
                      subText: 'This is a subText',
                      vibration: 1500,
                      ongoing: true,
                      autoCancel: false,
                      title: `My Notification Title${Date.now()}`,
                      message: 'My Notification Message',
                  });
              }}
              style={styles.menuButton}
            >
                <IconEntypo style={{ fontSize: 20, color: 'white' }} name="dots-three-vertical" />
            </Button>
        </Header>
        <Tabs
          locked
        >
            <Tab
              heading={
                  <TabHeading>
                      <IconMC style={styles.tabIcon} name="comment-text-outline" />
                  </TabHeading>
              }
            >
                <TaskSection />
            </Tab>
            {
                Level.SectorsLeftToClose > 0 &&
                <Tab
                  heading={
                      <TabHeading>
                          <IconMC style={styles.tabIcon} name="format-list-numbers" />
                          <Badge
                            info
                            style={styles.tabBadge}
                          >
                              <Text>
                                  {Level.SectorsLeftToClose}
                              </Text>
                          </Badge>
                      </TabHeading>
                    }
                >
                    <SectorsSection />
                </Tab>
            }
            {
                Hints.length > 0 &&
                <Tab
                  heading={
                      <TabHeading>
                          <IconMC style={styles.tabIcon} name="lightbulb" />
                          {
                              Hints.find(hint => hint.RemainSeconds > 0) &&
                              <Badge
                                info
                                style={styles.tabBadge}
                              >
                                  <CountableText
                                    start={Hints.find(hint => hint.RemainSeconds > 0).RemainSeconds}
                                    textStyle={{ color: Colors.white }}
                                  />
                              </Badge>
                          }
                      </TabHeading>
                    }
                >
                    <HintsSection />
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

    tabIcon: {
        fontSize: 30,
        color: Colors.white,
    },

    tabBadge: {
        transform: [{
            scale: 0.8,
        }],
    },
};

export default inject(mapStateToProps)(observer(GameView));
