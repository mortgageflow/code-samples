import { AnyAction, Dispatch, } from 'redux';
import store from 'store';
import axios from 'axios';
import { setIsUserLoading } from '../user/userReducer';
import { resetNegotiationState, setAllNegotiation, setAmountOfPages, setHighlights, setIsLoading, setNegotiationError, setOneNegotiation } from './negotiationReducer';
import { isPopUp } from '../popUp/popUpReducer';
import { toast } from 'react-toastify';
import { loadDebtors } from '../debtors/debtorsOperations';
import { Action } from '@sentry/react/dist/types';



export const loadNegotiationsOperation = (pageNum: number | undefined = 0, status?: CreditorAnswerStatus | string, isViewedByLender?: boolean, searchQuery?: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(setIsLoading(true))
        const { data } = await axios.get<{ answers: INegotiation[], pageNumber: string }>(`${process.env.NEXT_PUBLIC_API_URL}/answer/all-answers-for-lender-portal`, { params: { pageNum, status, searchQuery, isViewedByLender } });
        dispatch(setAllNegotiation(data.answers))
        dispatch(setAmountOfPages(data.pageNumber))
        dispatch(setIsLoading(false))

    } catch (e) {
        toast.error(e.response.data.message ? e.response.data.message : e.message)
        dispatch(setIsLoading(false))
        dispatch(setNegotiationError(e.response.data.message ? e.response.data.message : e.message))
    }
};


export const loadOneNegotiationOperation = (answerId: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(setIsLoading(true))

        const { data } = await axios.get<{ success: boolean, answer: INegotiation, convertedHighlights: IHighlights[] }>(`${process.env.NEXT_PUBLIC_API_URL}/answer/detailed-answer-for-lender-portal?answerId=${answerId}`);

        dispatch(setOneNegotiation(data.answer))
        dispatch(setHighlights(data.convertedHighlights))
        dispatch(setIsLoading(false))

    } catch (e) {
        toast.error(e.response.data.message ? e.response.data.message : e.message)

        dispatch(setIsLoading(false))
        dispatch(setNegotiationError(e.response.data.message ? e.response.data.message : e.message))

    }
};


export const answerCreditorOnNegotiationFromUserOperation = (answer: { answerOfCreditor: any, answerExplanation: string }, dateOfCreation: IDateWithOffset, answerId?: string,) => async (dispatch: Dispatch) => {

    try {
        dispatch(setIsLoading(true))

        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/creditor/${answerId}`, {
            answerOfCreditor: answer.answerOfCreditor,
            answerExplanation: answer.answerExplanation ? answer.answerExplanation : undefined,
            dateOfCreation,
        });


        dispatch(setOneNegotiation(data.answer))
        dispatch(setHighlights(data.convertedHighlights))

        const memoryPage = store.get('MemoryPageDebtors') //Data for updates debtors page
        dispatch(loadDebtors(memoryPage.page, memoryPage.select) as any); //Update debtors page

        console.log('memoryPage', memoryPage);

        dispatch(isPopUp(null))

        if (answer.answerOfCreditor === "ACCEPTED") toast.success('You accepted an offer');
        if (answer.answerOfCreditor === "DECLINED") toast.success('You declined an offer');
        if (answer.answerOfCreditor === "COUNTER_OFFERED") toast.success('You sent counter-offer');
        if (answer.answerOfCreditor === "REQUEST_SOFP") toast.success('You requested SOFP');
        dispatch(setIsLoading(false))

    } catch (e) {

        dispatch(isPopUp(null))
        toast.error(e.response?.data?.message ? e.response.data.message : e.message)
        dispatch(setNegotiationError(e.response?.data?.message ? e.response.data.message : e.message))
        dispatch(setIsLoading(false))
    }
};
