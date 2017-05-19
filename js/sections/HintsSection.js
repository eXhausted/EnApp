import React from 'react';
import { observer, inject } from 'mobx-react/native';
import { FlatList } from 'react-native';
import Colors from '../constants/colors';
import Hint from '../gameComponents/Hint';

const mapStateToProps = stores => ({
    gameStore: stores.gameStore,
    Hints: stores.gameStore.gameModel.Level.Helps,
});

const HintsSection = ({ Hints, gameStore: { isRefreshing, updateGameModel } }) => (
    <FlatList
      data={Hints}
      renderItem={({ item }) => (
          <Hint
            number={item.Number}
            hintText={item.HelpText}
            remainSeconds={item.RemainSeconds}
          />)
        }
      keyExtractor={hint => hint.HelpId}
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

export default inject(mapStateToProps)(observer(HintsSection));
