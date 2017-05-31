import React from 'react';
import { observer } from 'mobx-react/native';
import { Text, View } from 'react-native';

import Colors from '../constants/colors';

import HTMLView from '../core/components/HTMLView';

const AuthorMessage = ({ authorLogin, messageText, replaceNl2Br }) => (
    <View style={styles.mainContainer}>
        <View
          style={styles.coloredLabel}
        />
        <View style={styles.messageContainer}>
            <Text
              style={styles.authorLogin}
            >
                {`${authorLogin}:`}
            </Text>
            <HTMLView html={messageText} shouldReplaceNlToBr={replaceNl2Br} />
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
        color: Colors.gray,
    },
};

export default observer(AuthorMessage);
