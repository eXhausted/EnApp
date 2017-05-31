import React from 'react';
import { observer } from 'mobx-react/native';
import { Text, View } from 'react-native';

import Helper from '../util/helper';

import Colors from '../constants/colors';

import HTMLView from '../core/components/HTMLView';

const Bonus = ({ number, name, task, isAnswered, answerData, hint }) => (
    <View style={styles.mainContainer}>
        <View
          style={[
              styles.coloredLabel,
                { backgroundColor: isAnswered ? Colors.green : Colors.wrongCode },
          ]}
        />
        <View style={styles.bonusContainer}>
            <Text style={styles.bonusName}>{`#${number}   ${name}`}</Text>
            <Text
              style={[
                  styles.bonusValue,
                    { color: isAnswered ? Colors.rightCode : Colors.gray },
              ]}
            >
                { isAnswered ? answerData.Answer : '—'}
            </Text>
        </View>
        { isAnswered &&
            <View
              style={[
                  styles.bonusContainer,
                    { alignItems: 'flex-end', flexShrink: 1 },
              ]}
            >
                <Text style={styles.bonusInfo}>{ Helper.formatTime(answerData.AnswerDateTime.Value) }</Text>
                <Text style={[styles.bonusInfo, { marginTop: 2 }]}>{answerData.Login}</Text>
            </View>
        }
        {
            (!isAnswered && task) && <HTMLView html={task} />
        }
        {
            (isAnswered && hint) && <HTMLView html={hint} />
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

    bonusContainer: {
        flex: 2,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderColor: Colors.gray,
        borderBottomWidth: 0.5,
        borderTopWidth: 0.5,
    },

    bonusName: {
        color: Colors.white,
        fontFamily: 'Verdana',
        fontSize: 15,
    },

    bonusValue: {
        color: Colors.gray,
        fontFamily: 'Verdana',
        fontSize: 15,
    },

    bonusInfo: {
        color: Colors.gray,
        fontFamily: 'Verdana',
        fontSize: 13,
    },
};

export default observer(Bonus);
