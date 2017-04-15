import React from 'react';
import { observer } from 'mobx-react/native';
import { Text, View } from 'react-native';

import Helper from '../util/helper';

import Colors from '../constants/colors';

import CountableText from '../core/components/CountableText';
import HTMLView from '../core/components/HTMLView';

const Hint = ({ number, hintText, remainSeconds }) => (
    <View style={styles.mainContainer}>
        <View
          style={[
              styles.coloredLabel,
                { backgroundColor: remainSeconds === 0 ? Colors.green : Colors.wrongCode },
          ]}
        />
        <View style={styles.sectorContainer}>
            <Text style={styles.sectorName}>{`Подсказка ${number}`}</Text>
            <HTMLView html={remainSeconds === 0 ? hintText : '--'} />
        </View>
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

export default observer(Hint);
