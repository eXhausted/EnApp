import React, { Component } from 'react';
import { observer, inject } from 'mobx-react/native';
import { View, Text, ToastAndroid, Image } from 'react-native';
import { Container, Content, Spinner, Button } from 'native-base';
import { Sae } from 'react-native-textinput-effects';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Colors from '../constants/colors';
import API from '../util/API';
import asyncStorage from '../util/asyncStorage';

const mapStateToProps = stores => ({
    setActualView: stores.gameStore.setActualView,
});

class LoginView extends Component {
    state = {
        domainValue: '',
        idGameValue: '',
        loginValue: '',
        passwordValue: '',
    };

    async componentWillMount() {
        const storageValues = await asyncStorage.getItems([
            'domainValue',
            'idGameValue',
            'loginValue',
            'passwordValue',
        ]);

        this.setState({
            ...storageValues,
        });
    }

    onInputChange = (key, value) => {
        this.setState({
            [key]: value,
        });
    };

    signIn = async () => {
        const {
            domainValue,
            idGameValue,
            loginValue,
            passwordValue,
        } = this.state;

        await asyncStorage.setItems({
            domainValue,
            idGameValue,
            loginValue,
            passwordValue,
        });

        if (
            domainValue &&
            idGameValue &&
            loginValue &&
            passwordValue
        ) {
            const response = await API.loginUser();

            if (response.data.Error === 0) {
                await asyncStorage.setItem('cookiesValue', response.headers['set-cookie']);
                this.props.setActualView('LoadingView');
            } else {
                ToastAndroid.show(`Код: ${response.data.Error}   Ошибка: ${response.data.Message}`, ToastAndroid.SHORT);
            }
        }
    };

    render() {
        const {
            domainValue,
            idGameValue,
            loginValue,
            passwordValue,
        } = this.state;

        return (
            <View style={styles.mainContainer}>
                <View style={styles.imgContainer}>
                    <Image
                        style={styles.imgLogo}
                        resizeMode={Image.resizeMode.center}
                        source={require('../images/appIcon.png')}
                    />
                </View>
                <Sae
                    style={styles.inputWrapper}
                    label={'Домен'}
                    value={domainValue}
                    onChangeText={value => this.onInputChange('domainValue', value)}
                    iconClass={FontAwesomeIcon}
                    iconName={'globe'}
                    iconColor={'#f95a25'}
                    autoCapitalize={'none'}
                />
                <Sae
                    style={styles.inputWrapper}
                    label={'ID игры'}
                    value={idGameValue}
                    onChangeText={value => this.onInputChange('idGameValue', value)}
                    iconClass={FontAwesomeIcon}
                    iconName={'list-ol'}
                    iconColor={'#f95a25'}
                    autoCapitalize={'none'}
                    keyboardType={'numeric'}
                />
                <Sae
                    style={styles.inputWrapper}
                    label={'Логин'}
                    value={loginValue}
                    onChangeText={value => this.onInputChange('loginValue', value)}
                    iconClass={FontAwesomeIcon}
                    iconName={'user'}
                    iconColor={'#f95a25'}
                    autoCapitalize={'none'}
                />
                <Sae
                    style={styles.inputWrapper}
                    label={'Пароль'}
                    value={passwordValue}
                    onChangeText={value => this.onInputChange('passwordValue', value)}
                    iconClass={FontAwesomeIcon}
                    iconName={'key'}
                    iconColor={'#f95a25'}
                    autoCapitalize={'none'}
                    secureTextEntry
                />
                <Button
                    primary
                    block
                    disabled={
                        !domainValue ||
                      !idGameValue ||
                      !loginValue ||
                      !passwordValue
                    }
                    onPress={this.signIn}
                    style={styles.buttonWrapper}
                >
                    <Text>{'Вход'}</Text>
                </Button>
            </View>
        );
    }
}

const styles = {
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        paddingHorizontal: 30,
    },

    inputWrapper: {
        marginTop: 12,
    },

    buttonWrapper: {
        marginTop: 40,
    },

    imgContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    imgLogo: {
        width: 75,
        height: 75,
    },
};

export default inject(mapStateToProps)(observer(LoginView));
