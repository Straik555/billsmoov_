// @ts-nocheck
import React from 'react';
import { getAuth } from "firebase/auth";
import { userState, errorState, invoiceToApproveState, showCreditCardFormState } from '../atoms';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { checkmark } from 'ionicons/icons';
import { format } from "date-fns";
import CurrencyFormat from 'react-currency-format';
import { REST_API_URL } from '../constants/global';
import { handleErrors } from '../utils/handleErrors';
import {
  IonModal,
  IonList,
  IonItem,
  IonIcon,
  IonButton,
  IonSpinner,
  IonTextarea,
  useIonToast,
  IonAlert
} from '@ionic/react';

const InvoiceApproval: React.FC = () => {
  
  const user = useRecoilValue(userState);
  const setError = useSetRecoilState(errorState);
  const invoiceToApprove = useRecoilValue(invoiceToApproveState);
  const setInvoiceToApprove = useSetRecoilState(invoiceToApproveState);
  const setShowCreditCardForm = useSetRecoilState(showCreditCardFormState);
  
  const [approvalInProgress, setApprovalInProgress] = React.useState(false);
  const [showQuery, setShowQuery] = React.useState(false);
  const [showPaymentAlert, setShowPaymentAlert] = React.useState(false);
  const [invoiceUrl, setInvoiceUrl] = React.useState(null);
  const [query, setQuery] = React.useState('');
  
  const [present] = useIonToast();

  const getInvoiceUrl = invoiceId => getAuth().currentUser.getIdToken().then(token =>
      fetch(user._links.invoices.href + '/'+ invoiceId, {headers: {'Authorization': 'Bearer ' + token}})
        .then(handleErrors)
        .then(redirectURL => setInvoiceUrl(redirectURL))
        .catch(() => setError('Failed to load invoice.')));
        
  const approveInvoice = () => {
    if(!user.pinPaymentCustomerToken) {
      setShowPaymentAlert(true);
    } else {
      setApprovalInProgress(true);
      updateInvoice('PENDING_PAYMENT');
    }
  }
  
  const updateInvoice = status => getAuth().currentUser.getIdToken().then(token =>
    fetch(REST_API_URL + '/invoices/' + invoiceToApprove.id, {
      method: 'PATCH',
      body: JSON.stringify({status:status}),
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/merge-patch+json'
      }
    })
    .then(() => setInvoiceToApprove(null))
    .catch(() => setError('Failed to update invoice.'))
    .finally(() => setApprovalInProgress(false)));
    
  const submitQuery = () => {
    getAuth().currentUser.getIdToken().then(token =>
      fetch(REST_API_URL + '/invoices/' + invoiceToApprove.id + '/query', {
        method: 'POST',
        body: JSON.stringify({query:query}),
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/merge-patch+json'
        }
      })
      .then(() => {
        present("Your query has been submitted", 5000);
        setShowQuery(false);
      })
      .catch(() => setError('Failed to send query.')));
  }
  
  React.useEffect(() => !!invoiceToApprove && getInvoiceUrl(invoiceToApprove.id), [invoiceToApprove]);
  
  return (
      !!invoiceToApprove && 
      <IonModal isOpen={!!invoiceToApprove} 
        onDidDismiss={() => setInvoiceToApprove(null)}
        className="big-modal">
        
        <div className="invoice_container">
          <div className="invoice_detail">
            <IonList lines="none">
              <IonItem>
                <img src={invoiceToApprove.provider.logo.replace(/upload/,'upload/w_200,h_200,c_fit').replace(/.svg$/, '.png')} alt="provider_logo" />
              </IonItem>
              <IonItem>
                {invoiceToApprove.provider.service}
              </IonItem>
              <IonItem>
                {invoiceToApprove.status}
              </IonItem>
              <IonItem>
                <CurrencyFormat value={invoiceToApprove.total} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} prefix='$' displayType='text' />
              </IonItem>
              <IonItem>
                Billing period: {format(new Date(invoiceToApprove.startDate), 'd MMM')} - {format(new Date(invoiceToApprove.endDate), 'd MMM')}
              </IonItem>
              <IonItem>
                Due date: {format(new Date(invoiceToApprove.dueDate), 'd MMM')}
              </IonItem>
              <IonItem>
                {invoiceToApprove.status === 'USER_APPROVAL' ?
                  <IonButton size="medium" onClick={approveInvoice} disabled={invoiceToApprove.status !== 'USER_APPROVAL'}>
                    { approvalInProgress && <IonSpinner name="dots" />}
                    Approve
                  </IonButton>
                  :
                  <IonButton size="medium" color="success" disabled={true}>
                    <IonIcon icon={checkmark} /> Approved
                  </IonButton>
                }
              </IonItem>
              <IonItem style={{display:showQuery ? 'none' : ''}}>
                <IonButton size="medium" color="light" onClick={() => setShowQuery(true)}>
                  Query
                </IonButton>
              </IonItem>
              <IonItem style={{display:showQuery ? '' : 'none'}}>
                <IonList style={{width:'100%'}}>
                  <IonItem>
                    <IonTextarea
                      placeholder="Please submit your query and our team will get in contact."
                      onIonChange={event => setQuery(event.detail.value)} />
                  </IonItem>
                  <IonItem>
                    <IonButton size="medium" onClick={submitQuery}>Submit</IonButton>
                    <IonButton size="medium" color="light" onClick={() => setShowQuery(false)}>Cancel</IonButton>
                  </IonItem>
                </IonList>
              </IonItem>
            </IonList>
          </div>
          
          <div className="pdf_viewer">
            { invoiceUrl && <embed src={invoiceUrl} width="100%" height="100%"/> }
          </div>
        </div>
        
        <IonAlert
          isOpen={showPaymentAlert}
          onDidDismiss={() => setShowPaymentAlert(false)}
          header={"Payment details required"}
          message={"In order for us to pay your invoices you need to update your payment details."}
          buttons={[{
            text: 'Ok',
            handler: () => {
              setInvoiceToApprove(null);
              setShowCreditCardForm(true);
            }
          }]}  />
        
      </IonModal>
  );
}

export default InvoiceApproval;
