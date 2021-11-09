import { Dispatch, } from 'redux';
import store from 'store';
import axios from 'axios';
import { setIsUserLoading, setUser } from './userReducer';



export const loadUserOperation = () => async (dispatch: Dispatch) => {
    const token = store.get('AxcesTocen');

    try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/lender/lenderForAuth`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        axios.defaults.headers.Authorization = `Bearer ${token}`;
        if (data.success) {
            dispatch(setUser(data.user));
        }

        dispatch(setIsUserLoading(false));

    } catch (e) {
        dispatch(setIsUserLoading(false));
    }


};
