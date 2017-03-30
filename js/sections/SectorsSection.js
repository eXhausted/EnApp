import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { View, ListView, RefreshControl } from 'react-native';
import Colors from '../constants/colors';
import Sector from '../gameComponents/Sector';

@observer
class SectorsSection extends Component {
    ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    renderSector = sectorData => (
        <Sector
          order={sectorData.Order}
          name={sectorData.Name}
          answerData={sectorData.Answer}
          isAnswered={sectorData.IsAnswered}
        />
    );

    render() {
        const { sectors, isRefreshing, updateGameModel } = this.props;
        const dataSource = this.ds.cloneWithRows(sectors);

        return (
            <ListView
              dataSource={dataSource}
              renderRow={sectorData => this.renderSector(sectorData)}
              refreshControl={
                  <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={() => updateGameModel()}
                  />
                  }
              style={styles.mainContainer}
            />
        );
    }
}

const styles = {
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.background,
    },
};

export default SectorsSection;
