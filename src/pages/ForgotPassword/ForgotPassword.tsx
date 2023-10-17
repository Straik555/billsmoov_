// @ts-nocheck
import React, { FC, useState } from 'react';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useSetRecoilState } from 'recoil';
import {showSignInState, errorState, showForgotPasswordState} from '../../atoms';
import {
  IonContent,
  IonButton,
  IonList,
  IonItem,
  IonInput,
  IonIcon,
  IonSpinner,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonLabel,
} from '@ionic/react';
import {validationEmail} from "../../utils/validationEmail";

const ForgotPassword: FC = () => {

  const [email, setEmail] = useState<string>('');
  const [inProgress, setInProgress] = useState<boolean>(false);

  const setShowSignIn = useSetRecoilState(showSignInState);
  const setShowForgotPassword = useSetRecoilState(showForgotPasswordState);
  const setError = useSetRecoilState(errorState);

  const resetPassword = () => {
    setInProgress(true)
    sendPasswordResetEmail(getAuth(), email)
      .then(() => setShowPasswordResetSent(true))
      .catch(() => setError('Failed to send password reset email.'))
      .finally(() => setInProgress(false));
    setShowSignIn(true)
  }

  return (
    <IonContent fullscreen>
      <IonCardContent className="h-full card-authentication">
        <IonCardContent className="left-authentication" />
        <IonCardContent className="right-authentication">
          <IonList lines="none" className="right-list-authentication">
            <IonCardHeader className="logo-authentication" />
            <IonCardSubtitle className="header-authentication">
              Reset Password
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
            <IonItem className="item-no-padding-start">
              <IonButton
                disabled={validationEmail(email)}
                onClick={resetPassword}
                size="medium"
                className="button-authentication"
              >
                { inProgress && <IonSpinner name="dots" /> }
                Reset password
              </IonButton>
            </IonItem>
            <IonItem className="already-authentication item-no-padding-start">
              Already have an account?
              <a
                className="link-authentication"
                onClick={() => {
                  setShowSignIn(true)
                  setShowForgotPassword(false)
                }}
              >
                Log in
              </a>
            </IonItem>
          </IonList>
        </IonCardContent>
      </IonCardContent>
    </IonContent>
  );
}

export default ForgotPassword;
