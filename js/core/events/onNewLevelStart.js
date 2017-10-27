import PushNotification from 'react-native-push-notification';
import gameStore from '../stores/gameStore';

export default () => {
    // PushNotification.cancelAllLocalNotifications();

    gameStore.setCurrentTabsPage(0);
    gameStore.changeActualCode('');
    gameStore.changeActualBonusCode('');
    gameStore.updatesQueue = [];

    gameStore.gameModel.Level.Helps.forEach((help) => {

    });
};
