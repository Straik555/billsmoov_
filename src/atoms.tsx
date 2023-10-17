import { atom } from "recoil";
import { viewDashboard } from './constants/global';

export const userState = atom({
    key: 'user',
    default: null
});

export const viewState = atom({
    key: 'view',
    default: viewDashboard
})

export const showSignInState = atom({
    key: 'showSignIn',
    default: window.location.pathname === '/signin'
});

export const showForgotPasswordState = atom({
    key: 'showForgotPassword',
    default: window.location.pathname === '/forgot-password'
});

export const showChangePasswordState = atom({
    key: 'showChangePassword',
    default: false
});

export const showBillRedirectState = atom({
    key: 'showBillRedirect',
    default: false
});

export const invoiceToApproveState = atom({
    key: 'invoiceToApprove',
    default: null
});

export const showPoAState = atom({
    key: 'showPoA',
    default: false
});

export const showCreditCardFormState = atom({
    key: 'showCreditCard',
    default: false
});

export const errorState = atom({
    key: 'error',
    default: null
});