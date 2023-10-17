// @ts-nocheck
import React from 'react';
import {userState, showSignInState, showForgotPasswordState} from '../../atoms';
import { useRecoilValue } from 'recoil';
import SignIn from '../../pages/SignIn';
import SignUp from '../../pages/SignUp';
import ForgotPassword from '../../pages/ForgotPassword';
import {
  IonProgressBar,
  IonContent,
} from '@ionic/react';

const Authentication: React.FC = props => {
  
  const {initialising} = props;
  
  const user = useRecoilValue(userState);
  const showSignIn = useRecoilValue(showSignInState);
  const showForgotPassword = useRecoilValue(showForgotPasswordState);

  return initialising
    ? <IonContent><IonProgressBar type="indeterminate" /></IonContent>
      : showForgotPassword
      ? <ForgotPassword />
        : showSignIn
        ? <SignIn userSignedIn={!!user} />
          : <SignUp userSignedIn={!!user} />
}

export default Authentication;
