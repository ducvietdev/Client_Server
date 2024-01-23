// ** Initial State
const initialState = {
    dataUserLogin: []
}

const dataUserLogin = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_USER':
            return { ...state, dataUserLogin: action.data }
        default:
            return { ...state }
    }
}

export default dataUserLogin