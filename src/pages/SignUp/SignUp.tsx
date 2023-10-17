// @ts-nocheck
import React, { useState, FC } from 'react';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useSetRecoilState } from 'recoil';
import { showSignInState } from '../../atoms';
import {
  IonContent,
  IonButton,
  IonList,
  IonItem,
  IonInput,
  IonSpinner,
  IonCardContent,
  IonLabel,
  IonCardSubtitle,
  IonCheckbox,
  IonAlert,
  IonCardHeader,
} from '@ionic/react';
import { validationEmail } from "../../utils/validationEmail";

const SignUp: FC = () => {
  
  const setShowSignIn = useSetRecoilState(showSignInState);
  const emailProvided = new URLSearchParams(window.location.search).get('email');
  
  const [email, setEmail] = useState<string>(emailProvided || '');
  const [password, setPassword] = useState<string>('');
  const [checked, setChecked] = useState<boolean>(false);

  const [inProgress, setInProgress] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [errorCode, setErrorCode] = useState<string>('');
  const defaultError = 'An error occured creating your account.';
  const [errorMessage, setErrorMessage] = useState<string>(defaultError);

  const createUser = () => {
    setInProgress(true);
    createUserWithEmailAndPassword(getAuth(), email, password)
      .catch(error => {
        setErrorCode(error.code);
        setErrorMessage(createErrorMessage(error));
        setShowError(true);
      })
      .finally(() => setTimeout(() => setInProgress(false), 1000));
  };
  
  const createErrorMessage = error => {
    switch(error.code) {
      case 'auth/email-already-in-use': return 'An account with email address ' + email + ' already exists. Please sign in.';
      default: return error.message || defaultError;
    }
  }

  return (
    <IonContent fullscreen>
      <IonCardContent className="h-full card-authentication">
        <IonCardContent className="left-authentication" />
        <IonCardContent className="right-authentication">
          <IonList lines="none" className="right-list-authentication">
            <IonCardHeader className="logo-authentication" />
            <IonCardSubtitle className="header-authentication">
              Sign Up
            </IonCardSubtitle>
            <IonLabel className="label-authentication">Email</IonLabel>
            <IonItem fill="outline" className="item-no-padding-start">
              <IonInput
                className="input-authentication"
                onIonChange={event => setEmail(event.detail.value)}
                value={email}
                type="email"
                required
              />
            </IonItem>
            <IonLabel className="label-authentication">Password</IonLabel>
            <IonItem fill="outline" className="item-no-padding-start">
              <IonInput
                className="input-authentication"
                onIonChange={event => setPassword(event.detail.value)}
                type="password"
                required
              />
            </IonItem>
            <IonItem className="agree-authentication item-no-padding-start">
              <IonCheckbox checked={checked} className="checked-authentication" onIonChange={e => setChecked(e.detail.checked)} />
              I agree to the<a className="link-authentication" href="">Terms, Privacy Policy</a> and <a className="link-authentication" href="">Fees</a>
            </IonItem>
            <IonItem className="item-no-padding-start">
              <IonButton
                size="medium"
                disabled={!password || validationEmail(email) || !checked}
                onClick={createUser}
                className="button-authentication"
              >
                { inProgress && <IonSpinner name="dots" /> } Create account
              </IonButton>
            </IonItem>
            <IonItem className="already-authentication item-no-padding-start">
              Already have an account?
              <a className="link-authentication" onClick={() => setShowSignIn(true)}>Log in</a>
            </IonItem>
          </IonList>
        </IonCardContent>
      </IonCardContent>

      <IonAlert
          isOpen={showError}
          onDidDismiss={() => setShowError(false)}
          header={'Sign Up failed'}
          message={errorMessage || defaultError}
          buttons={[
            {
              text: 'Ok',
              handler: () => {
                if(errorCode === 'auth/email-already-in-use') {
                  setShowSignIn(true);
                }
                return true;
              }
            }
          ]}
        />
    </IonContent>
);}

export default SignUp;
