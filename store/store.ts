import thunk, { ThunkAction } from 'redux-thunk'
import { createStore, applyMiddleware, compose, Action } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { userSlice } from './user/userReducer';
import { negotiationSlice } from './negotiation/negotiationReducer';
import { popUpSlice } from './popUp/popUpReducer';
import { debtorsSlice } from './debtors/debtorsSlice';
import { preloaderSlice } from './preloader/preloaderSlice';
import { statisticSlice } from './statistic/statisticReducer';




const initStore = (initialState: any) => {
    let composeEnhancers = compose

    if (process.browser) {
        composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    }

    const store = configureStore({
        reducer: {
            [userSlice.name]: userSlice.reducer,
            [negotiationSlice.name]: negotiationSlice.reducer,
            [popUpSlice.name]: popUpSlice.reducer,
            [debtorsSlice.name]: debtorsSlice.reducer,
            [preloaderSlice.name]: preloaderSlice.reducer,
            [statisticSlice.name]: statisticSlice.reducer,
        },
        devTools: true,
        middleware: [thunk]
    });

    return store
}





export default initStore

export type AppStore = ReturnType<typeof initStore>;
export type AppState = ReturnType<AppStore['getState']>;
export type AppDispatch = ReturnType<AppStore['dispatch']>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action>;