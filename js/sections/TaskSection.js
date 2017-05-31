import React from 'react';
import { observer, inject } from 'mobx-react/native';
import { ScrollView, Text, RefreshControl, View } from 'react-native';
import HTMLView from '../core/components/HTMLView';
import Colors from '../constants/colors';

import AuthorMessage from '../gameComponents/AuthorMessage';

const mapStateToProps = stores => ({
    gameStore: stores.gameStore,
    Level: stores.gameStore.gameModel.Level,
});

const TaskSections = ({ Level, gameStore: { isRefreshing, updateGameModel } }) => (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={updateGameModel}
          />
      }
    >
        {
            Level.Messages.length > 0
                ? Level.Messages.map(message =>
                    <AuthorMessage
                      key={message.MessageId}
                      authorLogin={message.OwnerLogin}
                      messageText={message.MessageText}
                      replaceNl2Br={message.ReplaceNl2Br}
                    />)
                : null
        }
        <View
          style={styles.mainContent}
        >
            {
                Level.Name
                    ? <Text style={styles.levelName}>{Level.Name}</Text>
                    : null
            }
            <View style={styles.taskWrapper}>
                <HTMLView
                  html={Level.Tasks[0].TaskText}
                  shouldReplaceNlToBr={Level.Tasks[0].ReplaceNlToBr}
                />
            </View>
        </View>
    </ScrollView>
);


const styles = {
    levelName: {
        fontSize: 19,
        color: Colors.white,
        fontWeight: 'bold',
        marginTop: 18,
    },

    scroll: {
        backgroundColor: Colors.background,
    },

    scrollContent: {
        backgroundColor: Colors.background,
    },

    mainContent: {
        paddingHorizontal: 10,
    },

    taskWrapper: {
        marginTop: 18,
    },
};

export default inject(mapStateToProps)(observer(TaskSections));
