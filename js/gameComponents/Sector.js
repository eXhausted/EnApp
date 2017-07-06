import React from 'react';
import { observer, inject } from 'mobx-react/native';
import { Text, View } from 'react-native';

import Helper from '../util/helper';

import Colors from '../constants/colors';

const mapStateToProps = stores => ({
    actualCode: stores.gameStore.actualCode,
});

const Sector = ({ order, name, answerData, isAnswered, actualCode }) => (
    <View
      style={[
          styles.mainContainer,
          { backgroundColor: (isAnswered && Helper.isEqualCode(answerData.Answer, actualCode)) ? Colors.bonus : Colors.background },
      ]}
    >
        <View
          style={[
              styles.coloredLabel,
              { backgroundColor: isAnswered ? Colors.green : Colors.wrongCode },
          ]}
        />
        <View style={styles.sectorContainer}>
            <Text style={styles.sectorName}>{`#${order}   ${name}`}</Text>
            <Text
              style={[
                  styles.sectorValue,
                  { color: isAnswered ? Colors.rightCode : Colors.gray },
              ]}
            >
                { isAnswered ? answerData.Answer : '—'}
            </Text>
        </View>
        { isAnswered &&
            <View
              style={[
                  styles.sectorContainer,
                  { alignItems: 'flex-end', flex: 1 },
              ]}
            >
                <Text style={styles.sectorInfo}>{ Helper.formatTime(answerData.AnswerDateTime.Value) }</Text>
                <Text style={[styles.sectorInfo, { marginTop: 2 }]}>{answerData.Login}</Text>
            </View>
        }
    </View>
);

const styles = {
    mainContainer: {
        minHeight: 50,
        flexDirection: 'row',
        backgroundColor: Colors.background,
    },

    coloredLabel: {
        width: 5,
        backgroundColor: Colors.green,
    },

    sectorContainer: {
        flex: 2,
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
        color: Colors.gray,
        fontFamily: 'Verdana',
        fontSize: 15,
    },

    sectorInfo: {
        color: Colors.gray,
        fontFamily: 'Verdana',
        fontSize: 13,
    },
};

export default inject(mapStateToProps)(observer(Sector));
