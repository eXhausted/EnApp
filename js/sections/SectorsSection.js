import React from 'react';
import { observer, inject } from 'mobx-react/native';
import { FlatList } from 'react-native';
import Colors from '../constants/colors';
import Sector from '../gameComponents/Sector';

const mapStateToProps = stores => ({
    gameStore: stores.gameStore,
    sectors: stores.gameStore.gameModel.Level.Sectors,
});

const SectorsSection = ({ sectors, gameStore: { isRefreshing, updateGameModel } }) => (
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
      style={styles.mainContainer}
    />
);

const styles = {
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.background,
    },
};

export default inject(mapStateToProps)(observer(SectorsSection));
