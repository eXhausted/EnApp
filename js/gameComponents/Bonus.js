import React from 'react';
import { observer } from 'mobx-react/native';
import { Text, View } from 'react-native';

import Helper from '../util/helper';

import Colors from '../constants/colors';

import HTMLView from '../core/components/HTMLView';
import CountableText from '../core/components/CountableText';

const Bonus = ({ number, name, task, isAnswered, answerData, hint, awardTime, expired, secondsToStart, secondsLeft }) => (
    <View style={styles.mainContainer}>
        <View
          style={[
              styles.coloredLabel,
              { backgroundColor:
                    do {
                        if (expired || secondsToStart > 0) { Colors.gray }
                        else if (isAnswered) { Colors.green }
                        else { Colors.wrongCode }
                    },
              },
          ]}
        />
        <View style={styles.bonusContentWrapper}>
            <View style={{ flexDirection: 'row' }}>
                <View style={styles.bonusContainer}>
                    <Text style={styles.bonusName}>{`#${number}   ${name || `Бонус ${number}`}`}</Text>
                    {secondsLeft > 0 && (
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.bonusValue}>{'осталось '}</Text>
                            <CountableText start={secondsLeft} textStyle={styles.bonusValue} />
                        </View>
                    )}
                    <View style={{ flexDirection: 'row' }}>
                        <Text
                          style={[
                              styles.bonusValue,
                              { color: isAnswered ? Colors.rightCode : Colors.gray },
                          ]}
                        >
                            {
                                do {
                                    if (expired) { 'время выполнения истекло' }
                                    else if (secondsToStart > 0) { 'будет доступен через ' }
                                    else if (isAnswered) { answerData.Answer }
                                    else { '—' }
                                }
                            }
                        </Text>
                        {secondsToStart > 0 && (
                            <CountableText start={secondsToStart} textStyle={styles.bonusValue} />
                        )}
                        {(isAnswered && awardTime > 0) && (
                            <Text style={[styles.bonusValue, { color: Colors.white }]}>
                                {' - '}
                            </Text>
                        )}
                        {(isAnswered && awardTime > 0) && (
                            <Text style={[styles.bonusValue, { color: Colors.bonus }]}>
                                {`награда ${Helper.formatCount(awardTime, { collapse: true, withUnits: true })}`}
                            </Text>
                        )}
                    </View>
                </View>
                { isAnswered && (
                    <View
                      style={[
                          styles.bonusContainer,
                          { alignItems: 'flex-end', flex: 1 },
                      ]}
                    >
                        <Text style={styles.bonusInfo}>{ Helper.formatTime(answerData.AnswerDateTime.Value) }</Text>
                        <Text style={[styles.bonusInfo, { marginTop: 2 }]}>{answerData.Login}</Text>
                    </View>
                )}
            </View>
            { (!isAnswered && task) ? (
                <View >
                    <Text style={styles.bonusTaskHintTitle}>{'Задание:'}</Text>
                    <HTMLView html={task} />
                </View>
            ) : null }
            { (isAnswered && hint) ? (
                <View >
                    <Text style={styles.bonusTaskHintTitle}>{'Подсказка:'}</Text>
                    <HTMLView html={hint} />
                </View>
            ) : null }
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

    bonusContentWrapper: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderColor: Colors.gray,
        borderBottomWidth: 0.5,
        borderTopWidth: 0.5,
    },

    bonusContainer: {
        flex: 2,
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

    bonusTaskHintTitle: {
        color: Colors.bonus,
        fontFamily: 'Verdana',
        fontSize: 13,
    },
};

export default observer(Bonus);
