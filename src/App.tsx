// @ts-nocheck
import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, sendEmailVerification, applyActionCode, deleteUser } from "firebase/auth";
import { userState, viewState, errorState, showChangePasswordState } from './atoms';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { handleErrors } from './utils/handleErrors';
import {
  viewDashboard,
  viewSettings,
  viewAccount,
  viewInvoices,
  viewProviders,
  viewBills,
  viewPayments,
  REST_API_URL,
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID
} from './constants/global';
import {
  Authentication,
  PoA,
  CreditCardForm,
  ChangePassword,
  Layout,
} from './components';
import Dashboard from './pages/Dashboard';
import Account from './pages/Account';
import Invoices from './pages/Invoices';
import Providers from './pages/Providers';
import Payments from './pages/Payments';
import Settings from './pages/Settings';
import Bills from './pages/Bills';
import {
  IonApp,
  IonContent,
  IonAlert,
  setupIonicReact
} from '@ionic/react';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

/* Global styles */
import './theme/global.css'

setupIonicReact();

initializeApp({
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID
});
  
const App: React.FC = () => {
  
  const [initialising, setInitialising] = useState<boolean>(true);

  const user = useRecoilValue(userState);
  const setUser = useSetRecoilState(userState);
  const error = useRecoilValue(errorState);
  const setError = useSetRecoilState(errorState);
  const view = useRecoilValue(viewState);
  const setView = useSetRecoilState(viewState);
  const setShowChangePassword = useSetRecoilState(showChangePasswordState);

  const syncBackendUser = firebaseUser => {
    setView(viewDashboard);

    getOrSaveUser(firebaseUser)
      .then(user => getAuth().currentUser.getIdToken().then(token =>
        Promise.all([
          // get user paymentInfo
          fetch(user._links.paymentInfo.href, {headers: {'Authorization': 'Bearer ' + token}})
            .then(handleErrors)
          ,
          // get user's providers
          fetch(user._links.invoiceRedirects.href, {headers: {'Authorization': 'Bearer ' + token}})
            .then(handleErrors)
            .then(json => Promise.all(
              json._embedded.invoiceRedirects.map(invoiceRedirect =>
                fetch(invoiceRedirect._links.provider.href, {headers: {'Authorization': 'Bearer ' + token}})
                  .then(handleErrors)
                  .then(provider => {
                    provider.status = invoiceRedirect.status;
                    return provider;
                  }))))
        ])
        .then(([paymentInfo, providers]) => setUser({
            ...user,
            paymentInfo:paymentInfo,
            providers:providers
          })) 
      ))
      .catch(() => setError('Failed to load your profile.'))
      .finally(() => setInitialising(false));
  }
  
  const getOrSaveUser = firebaseUser => getAuth().currentUser.getIdToken().then(token => 
    fetch(REST_API_URL + '/users/search/findByEmailIgnoreCase?email=' + firebaseUser.email, {headers: {'Authorization': 'Bearer ' + token}})
      .then(response => {
        if(response.ok) {
          return response.json().then(user => ({
              ...JSON.parse(JSON.stringify(firebaseUser)),
              ...user
            }));
        } else if(response.status === 404) {
          sendEmailVerification(firebaseUser);
          return fetch(REST_API_URL + '/users', {
                method: 'POST',
                body: JSON.stringify({
                  email: firebaseUser.email,
                  firebaseId: firebaseUser.uid
                }),
                headers: {
                  'Authorization': 'Bearer ' + token,
                  'Content-Type': 'application/json'
                }
            })
            .then(handleErrors)
            .then(user => ({
                ...JSON.parse(JSON.stringify(firebaseUser)),
                ...user
              }))
            .catch(() => {
              deleteUser(getAuth().currentUser);
              setError('Failed to create user.');
            });
        } else {
          throw new Error('Failed to load your profile (' + response.status + ')');
        }
      })
    );
  
  React.useEffect(() => { 
    onAuthStateChanged(getAuth(), firebaseUser => {
      setInitialising(true);
      const mode = new URLSearchParams(window.location.search).get('mode');
      const oobCode = new URLSearchParams(window.location.search).get('oobCode');
      if (firebaseUser) {
        // user signed in
        if('verifyEmail' === mode && oobCode && !firebaseUser.emailVerified) {
          applyActionCode(getAuth(), oobCode)
            .then(() => syncBackendUser({
              ...firebaseUser,
              emailVerified: true
            }))
            .catch(() => syncBackendUser(firebaseUser));      
        } else {
          syncBackendUser(firebaseUser);
        }
      } else if('resetPassword' === mode) {
        setInitialising(false);
        setShowChangePassword(true);
      } else {
        setInitialising(false);
      }
    });
  }, []);
  
  return (
    <IonApp>
      <Layout>
        { !user ? <Authentication initialising={initialising} /> :
          <IonContent>
            <Dashboard show={view === viewDashboard} />
            <Invoices show={view === viewInvoices} />
            <Providers show={view === viewProviders} />
            <Account show={view === viewAccount} />
            <Payments show={view === viewPayments} />
            <Settings show={view === viewSettings} />
            <Bills show={view === viewBills} />
          </IonContent>
        }
        <ChangePassword />
        {user && <PoA /> }
        {user && <CreditCardForm user={user} /> }

        <IonAlert
          isOpen={!!error}
          onDidDismiss={() => setError(null)}
          header={'Error'}
          message={error}
          buttons={['OK']} />
      </Layout>
    </IonApp>
  )}

export default App;
