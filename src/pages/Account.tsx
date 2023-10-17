// @ts-nocheck
import React from 'react';
import { userState, errorState, showCreditCardFormState, showSignInState } from '../atoms';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { getAuth, deleteUser, signOut } from "firebase/auth";
import { trash, logOutOutline, pencil, copyOutline } from 'ionicons/icons';
import {
  IonCard,
  IonList,
  IonItem,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  IonAlert,
  useIonToast
} from '@ionic/react';

const Account: React.FC = props => {
  
  const {show} = props;
  
  const user = useRecoilValue(userState);
  const setUser = useSetRecoilState(userState);
  const setError = useSetRecoilState(errorState);
  const setShowCreditCardForm = useSetRecoilState(showCreditCardFormState);
  const setShowSignIn = useSetRecoilState(showSignInState);
  
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [showEditProfile, setShowEditProfile] = React.useState(false);
  const [editField, setEditField] = React.useState({});
  
  const [present] = useIonToast();
  
  const userDelete = () => {
    deleteUser(getAuth().currentUser)
      .then(() => setUser(null))
      .catch(() => setError('Failed to delete your profile.'));
  }
  
  return (
    show && <div>
      <IonCard>
        <IonList lines="none">
          <IonItem>{user.name || 'your name'} <IonButton size="small" fill="none" color="dark"
            onClick={() => {
              setEditField({name:'name', value:user.name, placeholder:'Sarah Smith', type:'text'});
              setShowEditProfile(true);
            }}>
            <IonIcon icon={pencil}/></IonButton></IonItem>
          <IonItem>{user.email}</IonItem>
          <IonItem>
            <IonButton size="small" color="light" onClick={() => {navigator.clipboard.writeText(user.billingEmail); present('email address copied', 3000)}} >
              <IonIcon icon={copyOutline}/>&nbsp;<small>{user.billingEmail}</small>
            </IonButton>
          </IonItem>
        </IonList>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonButton size="small" onClick={() => setShowCreditCardForm(true)}>{user.pinPaymentCustomerToken ? 'Update' : 'Add'} payment details</IonButton>
              <IonButton onClick={() => setShowDeleteDialog(true)} color="light" size="small" style={{float:'right'}}><IonIcon icon={trash} color="danger" /> Delete account</IonButton>
              <IonButton onClick={() => signOut(getAuth()).finally(() => {setUser(null); setShowSignIn(true)})} color="light" size="small" style={{float:'right'}}><IonIcon icon={logOutOutline} /> Sign out</IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCard>
      
      <IonAlert
          isOpen={showEditProfile}
          onDidDismiss={() => setShowEditProfile(false)}
          header={'Update ' + editField.name}
          inputs={[
            editField
          ]}
          buttons={[
            {
              text: 'Update',
              handler: value => {
                setShowEditProfile(false);
                getAuth().currentUser.getIdToken().then(token => 
                  fetch(user._links.self.href, {
                    method: 'PATCH',
                    body: JSON.stringify(value),
                    headers: {
                      'Authorization': 'Bearer ' + token,
                      'Content-Type': 'application/merge-patch+json'
                    }
                  })
                  .then(() => setUser({...user, ...value}))
                  .catch(() => setError('Failed to update user details'))
                );
              }
            }
          ]}
        />
        
      <IonAlert
        isOpen={showDeleteDialog}
        onDidDismiss={() => setShowDeleteDialog(false)}
        header={"Delete account"}
        message={"Are you sure you want to permanently delete your account?"}
        buttons={[
            {
              text: 'Ok',
              handler: userDelete
            },
            {
              text: 'Cancel',
              role: 'cancel'
            }
        ]} />
    </div>
);}

export default Account;
