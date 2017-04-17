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
        <View style={styles.hintContainer}>
            <Text
              style={[
                  styles.hintName,
                { color: remainSeconds === 0 ? Colors.yellow : Colors.gray },
              ]}
            >
                {`Подсказка ${number}`}
            </Text>
            { remainSeconds === 0
                ? <HTMLView html={hintText} />
                : <CountableText start={remainSeconds} textStyle={{ color: Colors.gray }} />
            }
        </View>
    </View>
);

const styles = {
    mainContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.background,
    },

    coloredLabel: {
        width: 5,
        backgroundColor: Colors.green,
    },

    hintContainer: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderColor: Colors.gray,
        borderBottomWidth: 0.5,
        borderTopWidth: 0.5,
    },

    hintName: {
        fontFamily: 'Verdana',
        fontSize: 15,
    },
};

export default observer(Hint);
