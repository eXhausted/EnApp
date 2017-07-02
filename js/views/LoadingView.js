import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { observer, inject } from 'mobx-react/native';
import { Container, Content, Spinner, Button } from 'native-base';
import LoadingErrorStrings from '../constants/loadingErrorStrings';
import Colors from '../constants/colors';
import asyncStorage from "../util/asyncStorage";

const mapStateToProps = stores => ({
    gameModel: stores.gameStore.gameModel,
    updateGameModel: stores.gameStore.updateGameModel,
    setActualView: stores.gameStore.setActualView,
    isRefreshing: stores.gameStore.isRefreshing,
});

class LoadingView extends Component {

    componentDidMount() {
        this.updateGameModel();
    }

    updateGameModel = () => {
        const { updateGameModel } = this.props;

        updateGameModel();
    };

    logOut = async () => {
        await asyncStorage.setItem('cookiesValue', '');
        this.props.setActualView('LoginView');
    };

    render() {
        const { gameModel, isRefreshing, setActualView } = this.props;

        return (
            <Container >
                <Content contentContainerStyle={styles.mainContainer}>
                    <Text style={styles.errorTitle}>
                        {
                            Object.prototype.hasOwnProperty.call(gameModel, 'Level')
                                ? LoadingErrorStrings[gameModel.Event]
                                : LoadingErrorStrings.LOADING
                        }
                    </Text>
                    <View style={styles.spinnerContainer}>
                        { isRefreshing && <Spinner color={Colors.blue} /> }
                    </View>
                    <Button
                      primary
                      block
                      disabled={isRefreshing}
                      onPress={this.updateGameModel}
                    >
                        <Text>{'Обновить'}</Text>
                    </Button>
                    <Button
                        danger
                        block
                        onPress={this.logOut}
                    >
                        <Text>{'Выход'}</Text>
                    </Button>
                </Content>
            </Container>
        );
    }
}

const styles = {
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },

    errorTitle: {
        color: Colors.white,
        fontSize: 21,
    },

    spinnerContainer: {
        height: 100,
    },
};

export default inject(mapStateToProps)(observer(LoadingView));
