// @ts-nocheck
import React, { FC, useState } from 'react';
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { useSetRecoilState } from 'recoil';
import {showSignInState, errorState, showForgotPasswordState} from '../../atoms';
import {
  IonContent,
  IonButton,
  IonList,
  IonItem,
  IonInput,
  IonAlert,
  IonSpinner,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonLabel,
} from '@ionic/react';
import {validationEmail} from "../../utils/validationEmail";

const SignIn: FC = () => {
  
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [inProgress, setInProgress] = useState<boolean>(false);
  const [showPasswordResetSent, setShowPasswordResetSent] = useState<boolean>(false);
  
  const setShowSignIn = useSetRecoilState(showSignInState);
  const setForgotPassword = useSetRecoilState(showForgotPasswordState);
  const setError = useSetRecoilState(errorState);
  
  const signIn = () => {
    setInProgress(true);
    signInWithEmailAndPassword(getAuth(), email, password)
      .then(user => {
        setEmail('');
        setPassword('');
        setShowSignIn(false);
      })
      .catch(() => setError('Invalid credentials.'))
      .finally(() => setInProgress(false));
  }
  
  return (
    <IonContent fullscreen>
      <IonCardContent className="h-full card-authentication">
        <IonCardContent className="left-authentication" />
        <IonCardContent className="right-authentication">
          <IonList lines="none" className="right-list-authentication">
            <IonCardHeader className="logo-authentication" />
            <IonCardSubtitle className="header-authentication">
              Sign In
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
            <IonItem className="item-no-padding-start">
              <IonButton
                disabled={!password || validationEmail(email)}
                onClick={() => signIn()}
                size="medium"
                className="button-authentication"
              >
                { inProgress && <IonSpinner name="dots" /> }
                Sign in
              </IonButton>
            </IonItem>
            <IonItem className="item-no-padding-start">
              <IonButton
                onClick={() => setForgotPassword(true)}
                fill="clear"
                size="small"
              >
                Forgot password?
              </IonButton>
            </IonItem>
            <IonItem className="already-authentication item-no-padding-start">
              No account yet?
              <a className="link-authentication" onClick={() => setShowSignIn(false)}>Sign up</a>
            </IonItem>
          </IonList>
        </IonCardContent>
      </IonCardContent>
      <IonAlert
          isOpen={showPasswordResetSent}
          onDidDismiss={() => setShowPasswordResetSent(false)}
          header={'Password reset requested'}
          message={'A password reset email has been sent to you.'}
          buttons={[{
              text: 'Ok',
              handler: () => {
                setShowPasswordResetSent(false);
                setShowResetPassword(false);
              }
            }]}
        />
    </IonContent>
);}

export default SignIn;
