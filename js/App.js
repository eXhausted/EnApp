import React, { Component } from 'react';
import { Root } from 'native-base';
import MainView from './views/MainView';

export default class App extends Component {
    render() {
        return (
            <Root>
                <MainView />
            </Root>
        );
    }
}
