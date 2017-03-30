import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { ScrollView, Text, View, RefreshControl } from 'react-native';
import HTMLView from '../core/components/HTMLView';
import Colors from '../constants/colors';

@observer
class TaskSections extends Component {
    render() {
        const { levelName, taskText, shouldReplaceNlToBr, isRefreshing, updateGameModel } = this.props;
        return (
            <ScrollView
              style={styles.scroll}
              refreshControl={
                  <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={() => updateGameModel()}
                  />
                  }
            >
                <Text style={styles.levelName}>{levelName}</Text>
                <HTMLView
                  html={taskText}
                  shouldReplaceNlToBr={shouldReplaceNlToBr}
                />
            </ScrollView>
        );
    }
}

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

export default TaskSections;
