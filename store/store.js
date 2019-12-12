import axios from 'axios';
import {createStore,combineReducers,applyMiddleware} from 'redux';
import reduxThunk from 'redux-thunk';
//用户信息
const userState = {}

const LOGOUT = 'LOGOUT';

function userReducer(state=userState,action) {
    switch (action.type) {
        case LOGOUT:
            return {}
        default:
            return state;
    }
}

const allReducer = combineReducers({
    userInfo:userReducer
})

const allState = {
    userInfo:userState
}

export function logout() {
    return dispatch => {
        axios.post('/logout').then(res => {
            if(res.status === 200){
                dispatch({type:LOGOUT})
            }else {
                console.log('logout fail ',res);
            }
        }).catch(err => {
            console.log('logout fail ',err);
        })
    }
}

export default function initialStore(initState) {

    const store = createStore(
        allReducer,
        Object.assign({},allState,initState),
        applyMiddleware(reduxThunk)
    );
    store.subscribe(() => {
        console.log("change",store.getState());
    })
    return store;
}

