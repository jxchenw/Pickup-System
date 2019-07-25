import * as MERCHANT from '../constants/index'

const initialState = {
    orders: [],
    loading: false,
    error: null
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

        case MERCHANT.FETCH_ORDERS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
                orders: []
            };

        default:
            return state;
    }
}