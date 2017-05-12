import React from 'react';
import { observer, inject } from 'mobx-react/native';
import { ScrollView, Text, RefreshControl, View } from 'react-native';
import HTMLView from '../core/components/HTMLView';
import Colors from '../constants/colors';

const mapStateToProps = stores => ({
    gameStore: stores.gameStore,
    Level: stores.gameStore.gameModel.Level,
});

const TaskSections = ({ Level, gameStore: { isRefreshing, updateGameModel } }) => (
    <ScrollView
      contentContainerStyle={styles.scroll}
      refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={updateGameModel}
          />
      }
    >
        { Level.Name ? <Text style={styles.levelName}>{Level.Name}</Text> : null }
        <View style={styles.taskWrapper}>
            <HTMLView
              html={Level.Tasks[0].TaskText}
              shouldReplaceNlToBr={Level.Tasks[0].ReplaceNlToBr}
            />
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
        paddingHorizontal: 10,
        backgroundColor: Colors.background,
    },

    taskWrapper: {
        marginTop: 18,
    },
};

export default inject(mapStateToProps)(observer(TaskSections));
