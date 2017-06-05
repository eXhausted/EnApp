import React from 'react';
import { View, TextInput } from 'react-native';
import { observer, inject } from 'mobx-react/native';
import { Icon } from 'native-base';

import Helper from '../util/helper';

import Colors from '../constants/colors';

const mapStateToProps = stores => ({
    actualCode: stores.gameStore.actualCode,
    changeActualCode: stores.gameStore.changeActualCode,
    sendCode: stores.gameStore.sendCode,
    oldCodes: stores.gameStore.gameModel.Level.MixedActions,
});

const CodeSection = ({ actualCode, changeActualCode, sendCode, oldCodes }) => {
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
    } else {
        highlightColor = Colors.white;
    }

    return (
        <View style={styles.mainContainer}>
            <View style={[styles.inputWrapper, { borderColor: highlightColor }]}>
                <TextInput
                  blurOnSubmit
                  selectTextOnFocus
                  autoCorrect={false}
                  underlineColorAndroid="transparent"
                  returnKeyType="send"
                  onChangeText={code => changeActualCode(code)}
                  onSubmitEditing={() => sendCode()}
                  value={actualCode}
                  style={[styles.codeInput, { color: highlightColor }]}
                />
                { oldCode && <Icon style={{ color: highlightColor, fontSize: 25 }} name={iconName} /> }
            </View>
        </View>
    );
};

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
};

export default inject(mapStateToProps)(observer(CodeSection));
