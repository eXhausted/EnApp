import React, { Component } from 'react';
import { observer, inject } from 'mobx-react/native';
import { FlatList, View, Text } from 'react-native';
import { Switch } from 'native-base';
import Colors from '../constants/colors';
import Sector from '../gameComponents/Sector';

const mapStateToProps = stores => ({
    gameStore: stores.gameStore,
    sectors: stores.gameStore.gameModel.Level.Sectors,
});

class SectorsSection extends Component {
    state = {
        hideIsAnswered: false,
    };

    onChangeHideSwitch = (newValue) => {
        this.setState({
            hideIsAnswered: newValue,
        });
    };

    render() {
        let { sectors, gameStore: { isRefreshing, updateGameModel } } = this.props;

        if (this.state.hideIsAnswered) {
            sectors = sectors.filter(sector => !sector.IsAnswered);
        }

        return (
            <View style={styles.mainContainer}>
                <View style={styles.switchContainer}>
                    <Text style={styles.switchTitle}>{'Скрыть выполненные'}</Text>
                    <Switch
                      value={this.state.hideIsAnswered}
                      onValueChange={this.onChangeHideSwitch}
                      tintColor={Colors.gray}
                    />
                </View>
                <FlatList
                  data={sectors}
                  renderItem={({ item }) => (
                      <Sector
                        order={item.Order}
                        name={item.Name}
                        answerData={item.Answer}
                        isAnswered={item.IsAnswered}
                      />)
                }
                  keyExtractor={sector => sector.SectorId}
                  refreshing={isRefreshing}
                  onRefresh={updateGameModel}
                />
            </View>
        );
    }
}

const styles = {
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.background,
    },

    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 40,
        paddingHorizontal: 5,
    },

    switchTitle: {
        color: Colors.white,
        fontSize: 16,
    },
};

export default inject(mapStateToProps)(observer(SectorsSection));
