// @ts-nocheck
import React, { FC, useState, useRef } from 'react';
import { getAuth } from "firebase/auth";
import { userState, errorState, showPoAState } from '../../atoms';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { handleErrors } from '../../utils/handleErrors';
import { format, parseISO } from 'date-fns'
import {
  IonContent,
  IonModal,
  IonItem,
  IonLabel,
  IonInput,
  IonDatetime,
  IonButton,
  IonSpinner,
  IonAlert
} from '@ionic/react';

const PoA: FC = () => {
  
  const user = useRecoilValue(userState);
  const showPoA = useRecoilValue(showPoAState);
  
  const setUser = useSetRecoilState(userState);
  const setError = useSetRecoilState(errorState);
  const setShowPoA = useSetRecoilState(showPoAState);
  

  const [userName, setUserName] = useState<string>(user.name);
  const [userAddress, setUserAddress] = useState<string>(user.address);
  const [userDoB, setUserDoB] = useState<string>(user.dateOfBirth || '1900-01-01T00:00:00.000Z');
  const [signingInProgress, setSigningInProgress] = useState<boolean>(false);
  // const [providerAccounts, setProviderAccounts] = React.useState({});
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  
  const customDatetime = useRef();
  
  const updateUserAndCratePoA = () => {
    setSigningInProgress(true);
    
    getAuth().currentUser.getIdToken().then(token => {
      // update provider account numbers
      // Object.keys(providerAccounts).map(providerId => {
      //   return fetch(REST_API_URL + '/invoiceRedirects/' + user.id + "_" + providerId, {
      //     method: 'PATCH',
      //     body: JSON.stringify({account: providerAccounts[providerId]}),
      //     headers: {
      //       'Authorization': 'Bearer ' + token,
      //       'Content-Type': 'application/merge-patch+json'
      //     }
      //   })
      //   .then(handleErrors)
      //   .catch(() => console.error('Failed to update account number for provider ID ' + providerId));
      // })
      
      // update user information
      return fetch(user._links.self.href, {
          method: 'PATCH',
          body: JSON.stringify({
            name: userName,
            address: userAddress,
            dateOfBirth: userDoB
          }),
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/merge-patch+json'
          }
        })
        .then(handleErrors)
        .then(updatedUser => setUser({
          ...user,
          ...updatedUser
        }))
        .then(() => fetch(user._links.self.href + '/sign-poa', {headers: {'Authorization': 'Bearer ' + token}})
          .then(handleErrors)
          .then(() => {
            setShowConfirmation(true);
            // TODO: ping for completed signature
          })
          .catch(() => setError('Failed to send power of attorney.')))
        .catch(() => setError('Failed to update user details.'))
        .finally(() => setSigningInProgress(false));
    });
  }
  
  return (
    <IonModal isOpen={showPoA} onDidDismiss={() => setShowPoA(false)}>
      <p style={{margin:'25px 10px 10px 10px'}}>To redirect your bills to Billsmoov your {user.providers.length > 1 ? 'providers require' : 'provider requires'} the following information from you:</p>
      <IonItem>
        <IonLabel style={{minWidth:'100px'}}>Full name</IonLabel>
        <IonInput placeholder="Sarah Jones" value={userName} onIonChange={event => setUserName(event.detail.value!)} />
      </IonItem>
      <IonItem>
        <IonLabel style={{minWidth:'100px'}}>Address</IonLabel>
        <IonInput placeholder="123 Collins St, St Kilda, 3182" value={userAddress} onIonChange={event => setUserAddress(event.detail.value!)} />
      </IonItem>
      <IonItem>
        <IonLabel style={{minWidth:'100px', maxWidth:'100px'}}>Date of Birth</IonLabel>
        <IonButton id="dobModal" color="light">{format(parseISO(userDoB), 'dd/MM/yyyy')}</IonButton>
      </IonItem>
      {/* providers.map(provider =>
        <IonItem key={provider.id}>
          <IonLabel style={{minWidth:'100px'}}>{provider.name}</IonLabel>
          <IonInput placeholder="account or customer number"
            value={providerAccounts[provider.id]}
            onIonChange={event => setProviderAccounts({
              ...providerAccounts,
              [provider.id]: event.detail.value!
            })}/>
        </IonItem>
      ) */}
      <IonItem lines="none" style={{marginTop:'20px'}}>
        <IonButton size="medium" onClick={() => updateUserAndCratePoA()} disabled={signingInProgress || (!userName || !userAddress)}>
          { signingInProgress && <IonSpinner name="dots" /> }
          Sign authorisation
        </IonButton>
        <IonButton size="medium" onClick={() => setShowPoA(false)} color="light">Cancel</IonButton>
      </IonItem>
      
      <IonModal trigger="dobModal">
        <IonContent>
          <IonDatetime presentation="date" value={userDoB} ref={customDatetime}
            onIonChange={event => {
              setUserDoB(event.detail.value!);
              customDatetime.current.closeParentOverlay();
            }} />
        </IonContent>
      </IonModal>
      
      <IonAlert
        isOpen={showConfirmation}
        onDidDismiss={() => setShowConfirmation(false)}
        header={'Authorisation sent'}
        message={'To complete your bill redirect request, please sign the request we sent to ' + user.email}
        buttons={[
            {
              text: 'Ok',
              handler: () => setShowPoA(false)
            }
        ]}
      />
    </IonModal>
  );
}

export default PoA;
