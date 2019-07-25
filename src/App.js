/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react'
import { createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation';

import HomeScreen from './pages/HomeScreen'
import LoginScreen from './pages/LoginScreen';
import AuthLoadingScreen from './pages/AuthLoadingScreen';
import PickupScreen from './pages/PickupScreen';
import { createStore, applyMiddleware } from 'redux';

import { Provider } from 'react-redux'
import thunk from 'redux-thunk';
import { fetchOrders } from './actions/merchant_action'
import merchant_reducer from './reducers/merchant_reducer'
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';

const appNavigator = createSwitchNavigator(
	{
		AuthLoading: AuthLoadingScreen,
		Auth: createStackNavigator({
			Login: LoginScreen
		}),
		App: createStackNavigator({
			Home: HomeScreen,
		}),
		Clients: createStackNavigator({
			Pickup: PickupScreen
		})
	}, {
		initialRouteName: 'AuthLoading',
		headerMode: 'none'
	}

);

const Navigator = createAppContainer(appNavigator)

const client = axios.create({ //all axios can be used, shown in axios documentation
	baseURL: 'http://dummy.restapiexample.com/api/v1',
	responseType: 'json',
	validateStatus: function (status) {
		return status >= 200 && status < 300
	}
});

let store = createStore(merchant_reducer, applyMiddleware(
	thunk,
	axiosMiddleware(client)
))

store.dispatch(fetchOrders());

class Nav extends Component {
	render() {
		return (
			<Provider store={store}>
				<Navigator />
			</Provider>
		)
	}
}

export default Nav