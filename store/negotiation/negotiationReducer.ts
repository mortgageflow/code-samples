import { createReducer, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";



interface INegotiationSlice {
    negotiations: INegotiation[],
    isLoadingNegotiation: boolean,
    oneNegotiation: null | INegotiation,
    highlightsOfOneNegotiation: null | IHighlights[],
    negotiationError: null | string,
    countOfPages: null | string,
}

const negotiationState: INegotiationSlice = {
    negotiations: [],
    oneNegotiation: null,
    highlightsOfOneNegotiation: null,
    isLoadingNegotiation: true,
    negotiationError: null,
    countOfPages: null,
};


export const negotiationSlice = createSlice({
    name: 'negotiation',
    initialState: negotiationState,
    reducers: {

        setAmountOfPages(state, action) {
            return { ...state, countOfPages: action.payload };
        },


        setAllNegotiation(state, action) {
            return { ...state, negotiations: action.payload, oneNegotiation: null, highlightsOfOneNegotiation: null };
        },

        setOneNegotiation(state, action) {
            return { ...state, oneNegotiation: action.payload, }
        },

        setHighlights(state, action) {
            return { ...state, highlightsOfOneNegotiation: action.payload }
        },

        resetNegotiationState() {
            return negotiationState
        },

        setIsLoading(state, action) {
            return { ...state, isLoadingNegotiation: action.payload }
        },
        setNegotiationError(state, action) {
            toast.error(action.payload)
            return { ...state, negotiationError: action.payload }
        }

    },
});


export const {
    setNegotiationError,
    setIsLoading,
    setAllNegotiation,
    setOneNegotiation,
    setHighlights,
    resetNegotiationState,
    setAmountOfPages

} = negotiationSlice.actions
