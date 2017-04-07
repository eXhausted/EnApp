import React, {Component} from "react";
import {observer} from "mobx-react/native";
import {FlatList} from "react-native";
import Colors from "../constants/colors";
import Sector from "../gameComponents/Sector";

@observer
class SectorsSection extends Component {

    render() {
        const { sectors, isRefreshing, updateGameModel } = this.props;

        return (
            <FlatList
                data={sectors}
                renderItem={({item}) => (
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
    }
}

const styles = {
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.background,
    },
};

export default SectorsSection;
