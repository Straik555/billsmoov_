// @ts-nocheck
import React, { useState } from 'react';
import { getAuth } from "firebase/auth";
import { userState, errorState, showCreditCardFormState } from '../../atoms';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { lockClosed } from 'ionicons/icons';
import { handleErrors } from '../../utils/handleErrors';
import {
  IonModal,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonButton,
  IonInput,
  IonSpinner,
  IonIcon,
  IonAlert
} from '@ionic/react';

const CreditCardForm = props => {
  
  const {user} = props;

  const showCreditCardForm = useRecoilValue(showCreditCardFormState);
  const setShowCreditCardForm = useSetRecoilState(showCreditCardFormState);
  const setError = useSetRecoilState(errorState);
  const setUser = useSetRecoilState(userState);
  
  const [ccNumber, setCcNumber] = useState<string>('');
  const [name, setName] = useState(user.name);
  const [expiry, setExpiry] = useState<string>('');
  const [cvc, setCvc] = useState<string>('');
  const [showError, setShowError] = useState<boolean>(false);
  const [showCreditCardAddedConfirmation, setShowCreditCardAddedConfirmation] = useState<boolean>(false);
  const [ccErrors, setCcErrors] = useState([]);
  const [paymentInProgress, setPaymentInProgress] = useState<boolean>(false);

  const isCreditCardValid = () => {
    return name
      && ccNumber && ccNumber.length >= 15
      && cvc && cvc.length >= 3 
      && expiry && expiry.length >= 4;
  }
  
  const submitCardDetails = () => {
    setPaymentInProgress(true);
    
    getAuth().currentUser.getIdToken().then(token => 
      fetch(user._links.self.href + '/card', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "number": ccNumber,
          "expiry_month": getMonth(expiry),
          "expiry_year": getYear(expiry),
          "cvc": cvc,
          "name": name,
        })
      })
      .then(handleErrors)
      .then(customerToken => {
        setUser({
          ...user,
          "pinPaymentCustomerToken": customerToken
        });
        setShowCreditCardAddedConfirmation(true);
      })
      .catch(() => setError('Failed to add credit card.'))
      .finally(() => setPaymentInProgress(false)));
  }
  
  const getMonth = expiry => {
    if(expiry.includes("/")) {
      return expiry.substr(0, expiry.indexOf('/')).trim();
    } else {
      return expiry.substring(0,2);
    }
  }
  
  const getYear = expiry => {
    let year = expiry.includes("/") ? expiry.substr(expiry.indexOf('/')+1) : expiry.substring(2);
    year = year.trim();
    return year.length === 2 ? "20"+year : year;
  }
  
  return (
    <IonModal isOpen={showCreditCardForm} onDidDismiss={() => setShowCreditCardForm(false)} >
      <IonGrid style={{textAlign:"center", maxWidth:"400px", marginTop:"50px"}}>
        <IonRow>
          <IonCol>
            <IonItem>
              <IonLabel position="floating">Card number</IonLabel>
              <IonInput name="cardnumber"
                autocomplete="cc-number"
                pattern="\d{19}" 
                inputmode="numeric" 
                maxlength={19} 
                required={true}
                value={ccNumber}
                onIonChange={event => setCcNumber(event.detail.value)}
                onIonInput={event => {let target:any = event.currentTarget; setCcNumber(target.value)}}
                />
            </IonItem>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonItem>
              <IonLabel position="floating">Name on card</IonLabel>
              <IonInput name="ccname"
                autocomplete="cc-name"
                inputmode="text"
                maxlength={50}
                required={true}
                value={name}
                onIonChange={event => setName(event.detail.value)} 
                onIonInput={event => {let target:any = event.currentTarget; setName(target.value)}}
                />
            </IonItem>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonItem>
              <IonLabel position="floating">MM / YY</IonLabel>
              <IonInput name="cc-exp"
                autocomplete="cc-exp"
                inputmode="text"
                pattern="[0-9 \/]"
                maxlength={9}
                required={true}
                value={expiry}
                onIonChange={event => setExpiry(event.detail.value)} 
                onIonInput={event => {let target:any = event.currentTarget; setExpiry(target.value)}}
                />
            </IonItem>
          </IonCol>
          <IonCol>
            <IonItem>
              <IonLabel position="floating">CVC</IonLabel>
              <IonInput name="cvc"
                autocomplete="cc-csc"
                pattern="\d{3,4}"
                inputmode="numeric"
                minlength={3}
                maxlength={4}
                required={true}
                value={cvc}
                onIonChange={event => setCvc(event.detail.value)} 
                onIonInput={event => {let target:any = event.currentTarget; setCvc(target.value)}}
                />
            </IonItem>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonButton onClick={() => submitCardDetails()}
              disabled={!isCreditCardValid() || paymentInProgress}>
              {paymentInProgress ? <IonSpinner name="dots" /> : <IonIcon icon={lockClosed} />}
              &nbsp;Save
            </IonButton>
            <IonButton onClick={() => setShowCreditCardForm(false)} color="light">
              Cancel
            </IonButton>
          </IonCol>
        </IonRow>
  
        <IonAlert
          isOpen={showCreditCardAddedConfirmation}
          onDidDismiss={() => setShowCreditCardAddedConfirmation(false)}
          header={'Payment details updated'}
          message={'Thank you for adding your payment details.'}
          buttons={[{
            text: 'Close',
            handler: () => setShowCreditCardForm(false)
          }]}
        />
        
        <IonAlert
          isOpen={showError}
          onDidDismiss={() => setShowError(false)}
          header={'Card details invalid'}
          message={ccErrors.toString()}
          buttons={['Ok']}
        />
        
      </IonGrid>
    </IonModal>
  )
}

export default CreditCardForm;