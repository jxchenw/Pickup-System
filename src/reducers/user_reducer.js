import * as USER from '../constants/index'

const initialState = {
    user_token: null,
    loading: false,
    error: null
};

export default function user_reducer(state = initialState, action) {
    console.log(action.type)

    switch (action.type) {
        case USER.USER_LOGIN:
            return {
                ...state,
                loading: true,
                error: null
            }
        case USER.USER_LOGIN_SUCCESS:
            return {
                ...state,
                loading: false,
                user_token: action.payload.user
            };

        case USER.USER_LOGIN_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
                user_token: null
            };

        default:
            return state;
    }
}