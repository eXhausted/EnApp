import React from 'react';
import { Text } from 'react-native';
import { observer, inject } from 'mobx-react/native';
import Helper from '../../util/helper';

const mapStateToProps = stores => ({
    globalTimerCounter: stores.gameStore.globalTimerCounter,
    updateGameModel: stores.gameStore.updateGameModel,
});

const CountableText = ({ globalTimerCounter, updateGameModel, increment, start, textStyle }) => {
    let counter = Math.round(start);

    if (increment === true) {
        counter += globalTimerCounter;
    } else {
        counter -= globalTimerCounter;
        if (counter <= 0) {
            updateGameModel();
            counter = 0;
        }
    }

    return <Text style={textStyle}>{Helper.formatCount(counter)}</Text>;
};


CountableText.defaultProps = {
    start: 0,
    increment: false,
};

export default inject(mapStateToProps)(observer(CountableText));
