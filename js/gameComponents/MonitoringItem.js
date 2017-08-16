import React from 'react';
import { observer, inject } from 'mobx-react/native';
import { Text, View } from 'react-native';

import Helper from '../util/helper';

import Colors from '../constants/colors';

const mapStateToProps = stores => ({
    localUserId: stores.gameStore.gameModel.UserId,
});

const MonitoringItem = ({ login, userId, kind, answer, enterLocalTime, isCorrect, localUserId }) => (
    <View
        style={[
            styles.mainContainer,
            { backgroundColor: userId === localUserId ? Colors.gray : Colors.background },
        ]}
    >
        <View
            style={[
                styles.coloredLabel,
                { backgroundColor: isCorrect ? Colors.green : Colors.wrongCode },
            ]}
        />
        <View style={styles.sectorContainer}>
            <Text
                style={[
                    styles.sectorValue,
                ]}
            >
                { enterLocalTime }
            </Text>
        </View>
        <View
            style={[
                styles.sectorContainer,
            ]}
        >
            <Text
                style={[
                    styles.sectorValue,
                ]}
            >
                { answer }
            </Text>
        </View>
        <View
            style={[
                styles.sectorContainer,
            ]}
        >
            <Text
                style={[
                    styles.sectorValue,
                ]}
            >
                { login }
            </Text>
        </View>
    </View>
);

const styles = {
    mainContainer: {
        minHeight: 50,
        flexDirection: 'row',
        backgroundColor: Colors.background,
        flex: 1,
    },

    coloredLabel: {
        width: 5,
        backgroundColor: Colors.green,
    },

    sectorContainer: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderColor: Colors.gray,
        borderBottomWidth: 0.5,
        borderTopWidth: 0.5,
    },

    sectorName: {
        color: Colors.white,
        fontFamily: 'Verdana',
        fontSize: 15,
    },

    sectorValue: {
        color: Colors.white,
        fontFamily: 'Verdana',
        fontSize: 15,
    },

    sectorInfo: {
        color: Colors.gray,
        fontFamily: 'Verdana',
        fontSize: 13,
    },
};

export default inject(mapStateToProps)(observer(MonitoringItem));
