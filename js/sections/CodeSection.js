import React, { Component } from 'react';
import { View, TextInput, Alert, Text, Animated, Easing, KeyboardAvoidingView } from 'react-native';
import { observer, inject } from 'mobx-react/native';
import { Icon, Button } from 'native-base';

import Helper from '../util/helper';

import Colors from '../constants/colors';
import CountableText from '../core/components/CountableText';

import MonitoringSection from './MonitoringSection';

const mapStateToProps = stores => ({
    actualCode: stores.gameStore.actualCode,
    actualBonusCode: stores.gameStore.actualBonusCode,
    changeActualCode: stores.gameStore.changeActualCode,
    changeActualBonusCode: stores.gameStore.changeActualBonusCode,
    sendCode: stores.gameStore.sendCode,
    sendBonusCode: stores.gameStore.sendBonusCode,
    oldCodes: stores.gameStore.gameModel.Level.MixedActions,
    bonuses: stores.gameStore.gameModel.Level.Bonuses,
    hasAnswerBlockRule: stores.gameStore.gameModel.Level.HasAnswerBlockRule,
    blockDuration: stores.gameStore.gameModel.Level.BlockDuration,
    blockTargetId: stores.gameStore.gameModel.Level.BlockTargetId,
    attemtsNumber: stores.gameStore.gameModel.Level.AttemtsNumber,
    attemtsPeriod: stores.gameStore.gameModel.Level.AttemtsPeriod,
});

class CodeSection extends Component {
    state = {
        isMonitoringOpen: false,
    };

    blockDurationContainerShake = new Animated.Value(0);
    monitoringSectionOpen = new Animated.Value(0);

    blockDurationContainerShakeOffset = 15;
    monitoringSectionOpenedHeight = 300;

    sendCode = () => {
        const {
            actualCode,
            actualBonusCode,
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

    toggleMonitoringSection = () => {
        if (this.codeInput) {
            this.codeInput.blur();
        }

        if (this.bonusInput) {
            this.bonusInput.blur();
        }

        Animated.timing(
            this.monitoringSectionOpen,
            {
                toValue: this.state.isMonitoringOpen ? 0 : this.monitoringSectionOpenedHeight,
                duration: 300,
            },
        ).start(() => {
            this.setState({
                isMonitoringOpen: !this.state.isMonitoringOpen,
            });
        });
    };

    hideMonitoringSection = () => {
        Animated.timing(
            this.monitoringSectionOpen,
            {
                toValue: 0,
                duration: 300,
            },
        ).start(() => {
            this.setState({
                isMonitoringOpen: false,
            });
        });
    };

    render() {
        const {
            actualCode,
            actualBonusCode,
            changeActualCode,
            changeActualBonusCode,
            sendCode,
            sendBonusCode,
            oldCodes,
            bonuses,
            hasAnswerBlockRule,
            blockDuration,
            blockTargetId,
            attemtsNumber,
            attemtsPeriod,
        } = this.props;

        const {
            isMonitoringOpen,
        } = this.state;

        const oldCode = oldCodes.filter((code) => {
            if (hasAnswerBlockRule) return code.Kind === 1;

            return true;
        }).find(codeObject => Helper.isEqualCode(codeObject.Answer, actualCode));

        const oldBonusCode = oldCodes.filter(code => code.Kind === 2).find(codeObject => Helper.isEqualCode(codeObject.Answer, actualBonusCode));

        const { blockDurationContainerShakeOffset, blockDurationContainerShake } = this;

        let highlightColor,
            highlightBonusColor,
            iconName,
            bonusIconName;

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
                highlightColor = (oldCode.Kind === 2 && !hasAnswerBlockRule) ? Colors.bonus : Colors.rightCode;
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

        if (oldBonusCode) {
            if (oldBonusCode.IsCorrect) {
                highlightBonusColor = Colors.rightCode;
                bonusIconName = 'checkmark-circle';
            } else {
                highlightBonusColor = Colors.wrongCode;
                bonusIconName = 'close-circle';
            }
        } else {
            highlightBonusColor = Colors.bonus;
        }

        return (
            <View style={styles.mainContainer}>
                {
                    <Animated.View style={{ height: this.monitoringSectionOpen }}>
                        <MonitoringSection />
                    </Animated.View>
                }
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
                <KeyboardAvoidingView behavior={'padding'}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon
                            style={Object.assign({}, styles.inputIcon, { color: isMonitoringOpen ? Colors.tabBackground : Colors.white })}
                            name="list-box"
                            onPress={this.toggleMonitoringSection}
                        />
                        <View style={[styles.inputWrapper, { borderColor: highlightColor, flex: 1 }]}>
                            { hasAnswerBlockRule && <Icon style={Object.assign({}, styles.inputIcon, { color: Colors.upTime })} name="warning" /> }
                            <TextInput
                                blurOnSubmit
                                selectTextOnFocus
                                ref={(input) => { this.codeInput = input; }}
                                autoCorrect={!hasAnswerBlockRule}
                                underlineColorAndroid="transparent"
                                returnKeyType="send"
                                placeholder="Код"
                                placeholderTextColor={Colors.gray}
                                onChangeText={code => changeActualCode(code)}
                                onSubmitEditing={this.sendCode}
                                onFocus={this.hideMonitoringSection}
                                value={actualCode}
                                keyboardAppearance={'dark'}
                                style={[styles.codeInput, { color: highlightColor }]}
                            />
                            {
                                actualCode.length > 0 &&
                                <Icon
                                    style={Object.assign({}, styles.inputIcon, { color: Colors.white })}
                                    name="close"
                                    onPress={() => changeActualCode('')}
                                />
                            }
                        </View>
                    </View>
                    {
                        (hasAnswerBlockRule && bonuses.find(bonus => !bonus.IsAnswered)) &&
                        <View style={[styles.inputWrapper, { borderColor: highlightBonusColor, marginTop: 5 }]}>
                            <TextInput
                                blurOnSubmit
                                selectTextOnFocus
                                autoCorrect
                                ref={(input) => { this.bonusInput = input; }}
                                underlineColorAndroid="transparent"
                                returnKeyType="send"
                                placeholder="Бонус"
                                placeholderTextColor={Colors.gray}
                                onChangeText={code => changeActualBonusCode(code)}
                                onSubmitEditing={sendBonusCode}
                                onFocus={this.hideMonitoringSection}
                                value={actualBonusCode}
                                keyboardAppearance={'dark'}
                                style={[styles.codeInput, { color: highlightBonusColor }]}
                            />
                            {
                                actualBonusCode.length > 0 &&
                                <Icon
                                    style={Object.assign({}, styles.inputIcon, { color: Colors.white })}
                                    name="close"
                                    onPress={() => changeActualBonusCode('')}
                                />
                            }
                        </View>
                    }
                </KeyboardAvoidingView>
            </View>
        );
    }
}

const styles = {
    mainContainer: {
        backgroundColor: Colors.background,
        paddingVertical: 3,
        paddingHorizontal: 10,
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
        justifyContent: 'center',
        alignItems: 'center',
    },

    inputIcon: {
        fontSize: 25,
        width: 25,
        marginHorizontal: 5,
    },
};

export default inject(mapStateToProps)(observer(CodeSection));
