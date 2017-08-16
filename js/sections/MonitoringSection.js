import React, { Component } from 'react';
import { observer, inject } from 'mobx-react/native';
import { FlatList, View, Text } from 'react-native';
import Colors from '../constants/colors';
import MonitoringItem from '../gameComponents/MonitoringItem';

const mapStateToProps = stores => ({
    gameStore: stores.gameStore,
    actions: stores.gameStore.gameModel.Level.MixedActions,
});

class MonitoringSection extends Component {
    render() {
        const { gameStore, actions } = this.props;

        return (
            <View style={styles.mainContainer}>
                <FlatList
                    data={actions}
                    renderItem={({ item }) => (
                        <MonitoringItem
                            login={item.Login}
                            userId={item.UserId}
                            kind={item.Kind}
                            answer={item.Answer}
                            enterLocalTime={item.LocDateTime.split(' ')[1]}
                            isCorrect={item.IsCorrect}
                        />)
                    }
                    keyExtractor={action => action.ActionId}
                />
            </View>
        );
    }
}

const styles = {
    mainContainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: Colors.background,
    },
};

export default inject(mapStateToProps)(observer(MonitoringSection));
