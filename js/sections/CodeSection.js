import React, { Component } from 'react';
import { View, TextInput } from 'react-native';
import { observer } from 'mobx-react/native';
import { Icon, Spinner } from 'native-base';

import Helper from '../util/helper';

import Colors from '../constants/colors';

@observer
class CodeSection extends Component {
    render() {
        const { actualCode, changeActualCode, oldCodes, sendCode } = this.props;
        const oldCode = oldCodes.find(codeObject => Helper.isEqualCode(codeObject.Answer, actualCode));
        let highlightColor;

        if (oldCode) {
            if (oldCode.IsCorrect) {
                highlightColor = Colors.rightCode;
            } else {
                highlightColor = Colors.wrongCode;
            }
        } else {
            highlightColor = Colors.white;
        }

        return (
            <View style={styles.mainContainer}>
                <View style={[styles.inputWrapper, { borderColor: highlightColor }]}>
                    <TextInput
                      underlineColorAndroid="transparent"
                      autoCorrect={false}
                      returnKeyType="send"
                      onChangeText={code => changeActualCode(code)}
                      onSubmitEditing={() => sendCode()}
                      value={actualCode}
                      style={[styles.codeInput, { color: highlightColor }]}
                    />
                    { oldCode && <Icon style={{ color: highlightColor }} name={oldCode.isCorrect ? 'checkmark-circle' : 'close-circle'} /> }
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
    },

    codeInput: {
        flex: 1,
        color: Colors.rightCode,
        fontSize: 20,
        padding: 0,
    },
};

export default CodeSection;
