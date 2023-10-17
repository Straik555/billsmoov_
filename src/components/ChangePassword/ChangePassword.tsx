// @ts-nocheck
import React, { FC, useState } from 'react';
import { getAuth, verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { showChangePasswordState, errorState, showSignInState } from '../../atoms';
import { logInOutline } from 'ionicons/icons';
import {
  IonModal,
  IonButton,
  IonList,
  IonItem,
  IonInput,
  IonChip,
  IonIcon,
  IonSpinner,
  IonAlert
} from '@ionic/react';

const ChangePassword: FC = props => {
  
  const show = useRecoilValue(showChangePasswordState);
  const setShow = useSetRecoilState(showChangePasswordState);
  const setError = useSetRecoilState(errorState);
  const setShowSignIn = useSetRecoilState(showSignInState);
  
  show && setShowSignIn(true);
  
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  
  const oobCode = new URLSearchParams(window.location.search).get('oobCode');
  
  const [inProgress, setInProgress] = useState<boolean>(false);
  
  const changePassword = () => {
    setInProgress(true);
    verifyPasswordResetCode(getAuth(), oobCode)
      .then(email => {
        confirmPasswordReset(getAuth(), oobCode, password)
          .then(() => setShowConfirmation(true));
      })
      .catch(() => setError('Failed to change your password.'))
      .finally(() => setInProgress(false));
  }
  
  return (
    <IonModal isOpen={show}>
      <IonList lines="none" style={{margin:'auto', marginTop:'100px', maxWidth:'500px'}}>
        <IonItem><IonInput onIonChange={event => setPassword(event.detail.value)} type="password" placeholder="password" /></IonItem>
        <IonItem><IonInput onIonChange={event => setConfirmPassword(event.detail.value)} type="password" placeholder="confirm password" /></IonItem>
        <IonItem>
          <IonButton disabled={!password || password !== confirmPassword} onClick={changePassword} size="medium">
            { inProgress ? <IonSpinner name="dots" /> : <IonIcon icon={logInOutline} /> }
            Change password
          </IonButton>
        </IonItem>
        {password.length !== 0 && (password !== confirmPassword) && 
          <IonChip color="danger">Passwords do not match</IonChip> }
      </IonList>
      
      <IonAlert
        isOpen={showConfirmation}
        onDidDismiss={() => {}}
        header={"Password changed"}
        message={"Please log in using your new password."}
        buttons={[{
          text: 'Update',
          handler: () => setShow(false)
        }]}  />
        
    </IonModal>
);}

export default ChangePassword;
