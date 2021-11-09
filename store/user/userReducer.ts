import { createReducer, createSlice } from "@reduxjs/toolkit";

interface IUserSlice {
    isEmailConfirmed: boolean,
    isAccountVerifiedByAdmin: boolean,
    isPhoneConfirmed: boolean,
    isLenderOnBoardingCompleted: boolean,

    roles: string,
    email: string,
    fullName: string,
    numberOfEmployees: string,
    personPosition: string,
    phone: string,
    state: string,
    profileId: ILender,

    verificationToken?: string,
    isCanViewAdditionalPages: boolean,
    isUserLoading: boolean,
}

const userState: IUserSlice = {
    fullName: '',
    email: '',
    phone: '',
    isEmailConfirmed: false,
    isPhoneConfirmed: false,
    roles: '',
    isLenderOnBoardingCompleted: false,
    numberOfEmployees: '',
    state: '',
    personPosition: '',
    isAccountVerifiedByAdmin: false,
    isCanViewAdditionalPages: false,
    isUserLoading: true,
    profileId: {
        name: '',
        _id: "",
        address: {
            building: "",
            street: "",
            city: "",
            region: "",
            country: "",
            zip: "",
            formattedAddress: "",
            unit: "",
        },
        acnAbt: "",
        category: "",
        email: "",
        isVerified: false,
        phone: "",


    },
};


export const userSlice = createSlice({
    name: 'user',
    initialState: userState,
    reducers: {
        setName(state, action) {
            return { ...state, firstName: action.payload };
        },
        setEmail(state, action) {
            return { ...state, email: action.payload.email };
        },
        setCanViewAdditionalPages(state, { type, payload }) {
            return { ...state, isCanViewAdditionalPages: payload };
        },
        setUser(state, action) {
            return { ...state, ...action.payload }
        },
        setIsUserLoading(state, action) {
            return { ...state, isUserLoading: action.payload }
        },
        resetUserState() {
            return userState
        }

    },
});


export const {
    setName,
    setEmail,
    setCanViewAdditionalPages,
    setUser,
    setIsUserLoading,
    resetUserState

} = userSlice.actions

