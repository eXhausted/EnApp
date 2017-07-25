import { Alert } from 'react-native';
import { ActionSheet } from 'native-base';
import Colors from '../../constants/colors';
import Helper from '../../util/helper';
import asyncStorage from '../../util/asyncStorage';
import gameStore from '../../core/stores/gameStore';

const BUTTONS = [
    { text: 'Статистика', icon: 'list', iconColor: Colors.black },
    { text: 'Статистика уровня', icon: 'list-box', iconColor: Colors.black },
    { text: 'Выйти из игры', icon: 'log-out', iconColor: Colors.wrongCode },
    { text: 'О разработчике', icon: 'information-circle', iconColor: Colors.blue },
    { text: 'Отмена', icon: 'close', iconColor: Colors.gray },
];

const DESTRUCTIVE_INDEX = 1;
const CANCEL_INDEX = 3;

const onButtonClick = async (buttonIndex) => {
    if (buttonIndex === 0) {
        const {
            domainValue,
            idGameValue,
        } = await asyncStorage.getItems([
            'domainValue',
            'idGameValue',
        ]);

        Helper.openCustomTab(`http://${domainValue}/GameStat.aspx?gid=${idGameValue}`);
    } else if (buttonIndex === 1) {
        const {
            domainValue,
            idGameValue,
        } = await asyncStorage.getItems([
            'domainValue',
            'idGameValue',
        ]);

        Helper.openCustomTab(`http://${domainValue}/LevelStat.aspx?gid=${idGameValue}&level=${gameStore.gameModel.Level.Number}`);
    } else if (buttonIndex === 2) {
        gameStore.signOut();
    } else if (buttonIndex === 3) {
        Alert.alert(
            'О разработчике',
            Helper.formatWithNewLine([
                'Developer: necto68 (id 172218)',
                'Designer: FromtheMars (id 1467284)',
            ]),
        );
    }
};

export default () => {
    ActionSheet.show(
        {
            options: BUTTONS,
            cancelButtonIndex: CANCEL_INDEX,
            destructiveButtonIndex: DESTRUCTIVE_INDEX,
            title: 'Меню',
        },
        buttonIndex => onButtonClick(+buttonIndex),
    );
};
