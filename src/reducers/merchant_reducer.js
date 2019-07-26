import * as MERCHANT from '../constants/index'

const initialState = {
    orders: [],
    loading: false,
    error: null,
    is_success: false
};

export default merchant_reducer = (state = initialState, action) => {
    console.log(action.type)

    switch (action.type) {
        case MERCHANT.FETCH_ORDERS:
            return {
                ...state,
                loading: true,
                error: null
            }
        case MERCHANT.FETCH_ORDERS_SUCCESS:
            return {
                ...state,
                loading: false,
                orders: action.payload.orders
            };

        case MERCHANT.FETCH_ORDERS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
                orders: []
            };

        case MERCHANT.UPDATE_ORDERS:
            return {
                ...state,
                loading: true,
                error: null
            };
            
        case MERCHANT.UPDATE_ORDERS_SUCCESS:
            return {
                ...state,
                loading: false,
                is_success: action.payload.is_success
            };

        case MERCHANT.UPDATE_ORDERS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
                is_success: false
            };

        default:
            return state;
    }
}