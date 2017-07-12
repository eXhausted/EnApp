import React, { Component } from 'react';
import { View, TextInput, Alert, Text } from 'react-native';
import { observer, inject } from 'mobx-react/native';
import { Icon } from 'native-base';

import Helper from '../util/helper';

import Colors from '../constants/colors';
import CountableText from '../core/components/CountableText';

const mapStateToProps = stores => ({
    actualCode: stores.gameStore.actualCode,
    changeActualCode: stores.gameStore.changeActualCode,
    sendCode: stores.gameStore.sendCode,
    oldCodes: stores.gameStore.gameModel.Level.MixedActions,
    hasAnswerBlockRule: stores.gameStore.gameModel.Level.HasAnswerBlockRule,
    blockDuration: stores.gameStore.gameModel.Level.BlockDuration,
    blockTargetId: stores.gameStore.gameModel.Level.BlockTargetId,
    attemtsNumber: stores.gameStore.gameModel.Level.AttemtsNumber,
    attemtsPeriod: stores.gameStore.gameModel.Level.AttemtsPeriod,
});

class CodeSection extends Component {

    sendCode = () => {
        const {
            actualCode,
            oldCodes,
            sendCode,
            hasAnswerBlockRule,
            blockDuration,
        } = this.props;

        const oldCode = oldCodes.find(codeObject => Helper.isEqualCode(codeObject.Answer, actualCode));

        if (hasAnswerBlockRule && blockDuration > 0) {
            return null;
        } else if (hasAnswerBlockRule && oldCode && !oldCode.IsCorrect) {
            Alert.alert(
                'На уровне ограничение на перебор!',
                'Разрешить ввод старого неверного кода?',
                [
                    { text: 'Отмена', onPress: () => {}, style: 'cancel' },
                    { text: 'Разрешить', onPress: () => sendCode() },
                ],
            );
        } else {
            sendCode();
        }
    };

    render() {
        const {
            actualCode,
            changeActualCode,
            sendCode,
            oldCodes,
            hasAnswerBlockRule,
            blockDuration,
            blockTargetId,
            attemtsNumber,
            attemtsPeriod,
        } = this.props;

        const oldCode = oldCodes.find(codeObject => Helper.isEqualCode(codeObject.Answer, actualCode));
        let highlightColor;
        let iconName;

        if (oldCode) {
            if (oldCode.IsCorrect) {
                highlightColor = oldCode.Kind === 1 ? Colors.rightCode : Colors.bonus;
                iconName = 'checkmark-circle';
            } else {
                highlightColor = Colors.wrongCode;
                iconName = 'close-circle';
            }
        } else if (hasAnswerBlockRule && blockDuration > 0) {
            highlightColor = Colors.gray;
        } else if (hasAnswerBlockRule) {
            highlightColor = Colors.upTime;
        } else {
            highlightColor = Colors.white;
        }

        return (
            <View style={styles.mainContainer}>
                {
                    hasAnswerBlockRule &&
                    <View
                      style={styles.blockRuleContainer}
                    >
                        <Text
                          style={styles.blockRuleText}
                        >
                            {`Не более ${attemtsNumber} попыток за ${Helper.formatCount(attemtsPeriod, { withUnits: true, collapse: true })} для`}
                        </Text>
                        <Icon
                          name={blockTargetId === 2 ? 'people' : 'person'}
                          style={{ color: Colors.upTime, fontSize: 19, marginHorizontal: 5 }}
                        />
                    </View>
                }
                {
                    (hasAnswerBlockRule && blockDuration > 0) &&
                    <View style={styles.blockDurationContainer}>
                        <Text
                          style={{ color: Colors.gray }}
                        >
                            {'осталось '}
                        </Text>
                        <CountableText
                          start={blockDuration}
                          textStyle={{ color: Colors.gray }}
                        />
                    </View>
                }
                <View style={[styles.inputWrapper, { borderColor: highlightColor }]}>
                    { hasAnswerBlockRule && <Icon style={{ color: Colors.upTime, fontSize: 25, marginHorizontal: 5 }} name="warning" /> }
                    <TextInput
                      blurOnSubmit
                      selectTextOnFocus
                      autoCorrect={false}
                      underlineColorAndroid="transparent"
                      returnKeyType="send"
                      onChangeText={code => changeActualCode(code)}
                      onSubmitEditing={this.sendCode}
                      value={actualCode}
                      style={[styles.codeInput, { color: highlightColor }]}
                    />
                    { oldCode && <Icon style={{ color: highlightColor, fontSize: 25, marginHorizontal: 5 }} name={iconName} /> }
                </View>
            </View>
        );
    }
}

const styles = {
    mainContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
        padding: 3,
    },

    inputWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
        borderWidth: 1,
        borderRadius: 7,
    },

    codeInput: {
        flex: 1,
        color: Colors.rightCode,
        fontSize: 20,
        padding: 0,
    },

    blockRuleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },

    blockRuleText: {
        fontFamily: 'Verdana',
        color: Colors.upTime,
    },

    blockDurationContainer: {
        flexDirection: 'row',
    },
};

export default inject(mapStateToProps)(observer(CodeSection));
