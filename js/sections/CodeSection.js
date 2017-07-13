import React, { Component } from 'react';
import { View, TextInput, Alert, Text, Animated, Easing } from 'react-native';
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

    blockDurationContainerShake = new Animated.Value(0);

    blockDurationContainerShakeOffset = 15;

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
            this.blockDurationContainerShake.setValue(0);

            Animated.timing(
                this.blockDurationContainerShake,
                {
                    toValue: 10,
                    duration: 1000,
                    ease: Easing.bounce,
                },
            ).start();
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
        const { blockDurationContainerShakeOffset, blockDurationContainerShake } = this;
        let highlightColor;
        let iconName;

        const interpolateBlockDurationOffset = blockDurationContainerShake.interpolate({
            inputRange: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            outputRange: [
                0,
                -blockDurationContainerShakeOffset,
                blockDurationContainerShakeOffset,
                -blockDurationContainerShakeOffset,
                blockDurationContainerShakeOffset,
                -blockDurationContainerShakeOffset,
                blockDurationContainerShakeOffset,
                -blockDurationContainerShakeOffset,
                blockDurationContainerShakeOffset,
                -blockDurationContainerShakeOffset,
                0,
            ],
        });

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
                    <Animated.View
                      style={[
                          styles.blockDurationContainer,
                          {
                              transform: [
                                  { translateX: interpolateBlockDurationOffset },
                              ],
                          },
                      ]}
                    >
                        <Text
                          style={{ color: Colors.gray }}
                        >
                            {'осталось '}
                        </Text>
                        <CountableText
                          start={blockDuration}
                          textStyle={{ color: Colors.gray }}
                        />
                    </Animated.View>
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
