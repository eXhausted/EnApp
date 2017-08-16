import React from 'react';
import { observer } from 'mobx-react/native';
import { Text, View } from 'react-native';

import Colors from '../constants/colors';

import CountableText from '../core/components/CountableText';
import HTMLView from '../core/components/HTMLView';

const Hint = ({ number, hintText, remainSeconds }) => (
    <View style={styles.mainContainer}>
        <View
            style={[
                styles.coloredLabel,
                { backgroundColor: remainSeconds === 0 ? Colors.green : Colors.gray },
            ]}
        />
        <View style={styles.messageContainer}>
            <Text
                style={[
                    styles.authorLogin,
                    { color: remainSeconds === 0 ? Colors.yellow : Colors.white },
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

    messageContainer: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderColor: Colors.gray,
        borderBottomWidth: 0.5,
        borderTopWidth: 0.5,
    },

    authorLogin: {
        fontFamily: 'Verdana',
        fontSize: 15,
    },
};

export default observer(Hint);
