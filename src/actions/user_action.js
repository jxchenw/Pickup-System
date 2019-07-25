import axios from 'axios'
import * as USER from '../constants/index'

export const userLoginBegin = () => ({
    type: USER.USER_LOGIN
});

export const userLoginSuccess = user => ({
    type: USER.USER_LOGIN_SUCCESS,
    payload: { user }
});

export const userLoginFailure = error => ({
    type: USER.USER_LOGIN_FAIL,
    payload: { error }
});

export const userLogin = (username, password) => {
    return dispatch => {
        dispatch(userLoginBegin());
        return axios.post('http://www.sunnysupermarket.com/sunny/admin/index.php?route=delivery/login', {
            params: {
                username, password
            }
        })
            .then(response => {
                if (response.status < 200 || response.status >= 300 || response.data.error) {
                    dispatch(userLoginFailure(response.data.error ? response.data.error : 'DB Error'))
                } else {
                    dispatch(userLoginSuccess(response.data.user_token));
                }
                return response.data;
            })
            .catch(error => dispatch(userLoginFailure(error)));
    };
}