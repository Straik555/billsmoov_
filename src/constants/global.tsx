const getConfig = hostname => {
    switch(hostname) {
        case 'app.billsmoov.com.au':
        case 'billsmoov-prod.web.app': return {
            api: 'https://rest.billsmoov.com.au',
            firebaseApiKey: "AIzaSyCJmjo1kxTp-HR5BQ6EluHao-7ZCQ-WhIA",
            firebaseAuthDomain: "billsmoov-prod.firebaseapp.com",
            firebaseProjectId: "billsmoov-prod",
            firebaseStorageBucket: "billsmoov-prod.appspot.com",
            firebaseMessagingSenderId: "747575478735",
            firebaseAppId: "1:747575478735:web:82a7fc494a9f121ca8fd7b",
            firebaseMeasurementId: "G-FQHFRYQWZ0"
        }
        default: return {
            api: 'https://billsmoov-development.herokuapp.com',
            firebaseApiKey: "AIzaSyBamoz0zQHbJ3jRcqQXl7VxdDQ58ZHXTXQ",
            firebaseAuthDomain: "billsmoov-dev.firebaseapp.com",
            firebaseProjectId: "billsmoov-dev",
            firebaseStorageBucket: "billsmoov-dev.appspot.com",
            firebaseMessagingSenderId: "348529404529",
            firebaseAppId: "1:348529404529:web:ab9165893c1475c80e8715",
            firebaseMeasurementId: "G-JFGT6SCDX8"
        }
    }
}

export const HOST = window.location.hostname.replace('www.', '');

export const viewDashboard = Symbol('dashboard');
export const viewAccount = Symbol('account');
export const viewProviders = Symbol('providers');
export const viewInvoices = Symbol('invoices');
export const viewPayments = Symbol('payments');
export const viewForgotPassword = Symbol('forgot-password');
export const viewSettings = Symbol('settings');
export const viewBills = Symbol('bills');

export const REST_API_URL = getConfig(HOST).api;
export const FIREBASE_API_KEY = getConfig(HOST).firebaseApiKey;
export const FIREBASE_AUTH_DOMAIN = getConfig(HOST).firebaseAuthDomain;
export const FIREBASE_PROJECT_ID = getConfig(HOST).firebaseProjectId;
export const FIREBASE_STORAGE_BUCKET = getConfig(HOST).firebaseStorageBucket;
export const FIREBASE_MESSAGING_SENDER_ID = getConfig(HOST).firebaseMessagingSenderId;
export const FIREBASE_APP_ID = getConfig(HOST).firebaseAppId;
export const FIREBASE_MEASUREMENT_ID = getConfig(HOST).firebaseMeasurementId;
