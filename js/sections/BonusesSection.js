import React from 'react';
import { observer, inject } from 'mobx-react/native';
import { FlatList } from 'react-native';
import Colors from '../constants/colors';
import Bonus from '../gameComponents/Bonus';

const mapStateToProps = stores => ({
    gameStore: stores.gameStore,
    bonuses: stores.gameStore.gameModel.Level.Bonuses,
});

const BonusesSection = ({ bonuses, gameStore: { isRefreshing, updateGameModel } }) => (
    <FlatList
      data={bonuses}
      renderItem={({ item }) => (
          <Bonus
            number={item.Number}
            name={item.Name}
            task={item.Task}
            isAnswered={item.IsAnswered}
            answerData={item.Answer}
            hint={item.Help}
          />)
        }
      keyExtractor={hint => hint.BonusId}
      refreshing={isRefreshing}
      onRefresh={updateGameModel}
      style={styles.mainContainer}
    />
);

const styles = {
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.background,
    },
};

export default inject(mapStateToProps)(observer(BonusesSection));
