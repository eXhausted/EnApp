import React from 'react';
import { observer, inject } from 'mobx-react/native';
import { ScrollView, Text, RefreshControl } from 'react-native';
import HTMLView from '../core/components/HTMLView';
import Colors from '../constants/colors';

const mapStateToProps = stores => ({
    gameStore: stores.gameStore,
    Level: stores.gameStore.gameModel.Level,
});

const TaskSections = ({ Level, gameStore: { isRefreshing, updateGameModel } }) => (
    <ScrollView
      style={styles.scroll}
      refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={updateGameModel}
          />
      }
    >
        <Text style={styles.levelName}>{Level.Name}</Text>
        <HTMLView
          html={Level.Tasks[0].TaskText}
          shouldReplaceNlToBr={Level.Tasks[0].ReplaceNlToBr}
        />
    </ScrollView>
);


const styles = {
    levelName: {
        fontSize: 19,
        color: Colors.white,
        fontWeight: 'bold',
        paddingVertical: 18,
    },

    scroll: {
        flex: 1,
        paddingHorizontal: 15,
        paddingBottom: 0,
        backgroundColor: Colors.background,
    },
};

export default inject(mapStateToProps)(observer(TaskSections));
