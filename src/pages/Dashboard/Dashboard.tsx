// @ts-nocheck
import React, { FC, useState, useEffect } from 'react';
import { userState, viewState, showCreditCardFormState, showBillRedirectState, errorState } from '../../atoms';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { getAuth, sendEmailVerification } from "firebase/auth";
import { mailOutline, cardOutline, cloudUploadOutline, checkmark, hourglassOutline, copyOutline } from 'ionicons/icons';
import { viewProviders, viewInvoices, REST_API_URL } from '../../constants/global';
import { PaymentInfo, Notification } from '../../components'
import { handleErrors } from '../../utils/handleErrors';
import { signupInProgress } from '../../utils/signupInProgress';
import {
  IonButton,
  IonSpinner,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonCol,
  useIonToast,
  IonContent,
  IonTitle,
  IonHeader,
} from '@ionic/react';
import InvoiceRedirect from './InvoiceRedirect'
import { PageProps } from "../Page.model";
import { NotificationVariant } from "../../components/Notification/Notification.model";
import './Dashboard.css'
import CheckIcon from '../../assets/Notification/check.svg'

const Dashboard: FC<PageProps> = ({ show }) => {
  const user = useRecoilValue(userState);
  const setView = useSetRecoilState(viewState);
  const setShowCreditCardForm = useSetRecoilState(showCreditCardFormState);
  const setShowBillRedirect = useSetRecoilState(showBillRedirectState);
  const showBillRedirect = useRecoilValue(showBillRedirectState);
  const setError = useSetRecoilState(errorState);

  const [sendingVerificationEmail, setSendingVerificationEmail] = useState<boolean>(false);
  const [verificationEmailSent, setVerificationEmailSent] = useState<boolean>(false);
  const [hasBills, setHasBills] = useState<boolean>(false);
  
  const [present] = useIonToast();
  
  // TODO: possible optimisation: this function really only needs to be called if ['CONTACTING_PROVIDERS', 'MANUAL_INVOICE_SEND'].includes(user.status)
  const getHasBills = () => getAuth().currentUser.getIdToken().then(token => {
    fetch(REST_API_URL + '/invoices/search/existsByUserId?userId=' + user.id, {headers: {'Authorization': 'Bearer ' + token}})
      .then(handleErrors)
      .then(hasBills => setHasBills(hasBills))
      .catch(() => console.error('Failed to fetch user hasBills'))});
  
  const resendVerificationEmail = () => {
    setSendingVerificationEmail(true);
    sendEmailVerification(getAuth().currentUser)
      .then(() => setVerificationEmailSent(true))
      .catch(error => {
        if(error.code === "auth/too-many-requests") {
          setVerificationEmailSent(true);
        } else {
          setError('Failed to resend email: ' + error.code);
        }
      })
      .finally(() => setSendingVerificationEmail(false));
  }
  
  const getNotifications = () => {
    let notifications = [];
    if(user) {
      if(['CONTACTING_PROVIDERS', 'MANUAL_INVOICE_SEND'].includes(user.status) && !hasBills) {
        notifications.push(
          <Notification
            icon={hourglassOutline}
            title="Waiting for bills to arrive"
            key="bill_wait"
            color="light"
            subTitle={
              <>
                We have not received any bills yet. <br/>
                If you want, we can redirect your bills for you.
                Just <a href="#" className="underline" onClick={event => {setView(viewProviders);event.preventDefault();}}>select your providers</a> and
                sign the authorisation.
              </>
            }
          />
        );
      }
      if(!['CONTACTING_PROVIDERS', 'MANUAL_INVOICE_SEND'].includes(user.status)
        && (!user.providers.length || user.providers.find(provider => provider.status === 'NEW'))) {
        notifications.push(
          <Notification
            icon={cloudUploadOutline}
            title="Redirect your bills"
            key="authorisation"
            subTitle={
              <>
                To pay your bills, you need to redirect your bills to Billsmoov for the following providers:<br/>
                <ul>
                  {user.providers.filter(provider => provider.status === 'NEW').map(provider => <li key={provider.id}>{provider.name} <small>{provider.service}</small></li>)}
                </ul>
              </>
            }
          >
            <IonButton onClick={() => setShowBillRedirect(true)}>Redirect bills</IonButton>
          </Notification>
        );
      }
      if(user.providers.length && user.providers.find(provider => provider.status === 'SIGNED' || provider.status === 'REQUESTED')) {
        notifications.push(
          <Notification
            icon={hourglassOutline}
            title="Bill redirect requested"
            key="redirectRequested"
            color="light"
            subTitle={
              <>
                We will notify you once your bill redirect requests have been approved.<br/>
                Redirect requests currently in progress:
                <ul>
                  {user.providers.filter(provider => provider.status === 'SIGNED').map(provider => <li key={provider.id}>{provider.name} <small>{provider.service}</small></li>)}
                </ul>
              </>
            }
          >
            <IonButton onClick={() => setView(viewProviders)}>View providers</IonButton>
          </Notification>
        );
      }
      if(!notifications.length) {
        notifications.push(
          <Notification
            icon={checkmark}
            title="No notifications"
            key="setup_complete"
            color="light"
            subTitle="Your account is setup and there are no actions to complete."
          >
            <IonButton onClick={() => setView(viewInvoices)}>View bills</IonButton>
          </Notification>
        );
      }
    }
    return notifications;
  }
  
  const signupFLow = () => (
    <>
      <IonHeader className="dashboard-header">
        <IonTitle className="dashboard-header-title">Welcome to Billsmoov</IonTitle>
      </IonHeader>
      <IonGrid>
        <IonRow className="dashboard-row">
          {showBillRedirect ?
            <InvoiceRedirect /> :
            <>
            <IonCol className="dashboard-row-col" size="6">
          {user.emailVerified ?
            <Notification
              icon={CheckIcon}
              key="email"
              title="Email confirmed"
              variant={NotificationVariant.SUCCESS}
              subTitle="Thank you for confirming your email address"
            /> :
            <Notification
              icon={mailOutline}
              key="email"
              title="Verify email address"
              subTitle={`Please verify your email address by clicking the link in the email we sent to ${user.email}`}
            >
          {verificationEmailSent ?
            <IonButton color="light" disabled={true} className="item-dashboard-button">
            <IonIcon icon={checkmark} /> Please check your inbox or junk mail
            </IonButton> :
            <IonButton onClick={resendVerificationEmail} className="item-dashboard-button">
          {sendingVerificationEmail && <IonSpinner name="dots" />}
            Resend email
            </IonButton>}
            </Notification>
          }
            </IonCol>
          {
            // user.pinPaymentCustomerToken ?
            //   <IonCard color="success" style={{maxWidth:'1000px'}}>
            //     <IonCardHeader>
            //       <IonCardTitle><IonIcon icon={checkmark} /> Payment details added</IonCardTitle>
            //     </IonCardHeader>
            //   </IonCard>
            //   :
            //   <Notification icon={cardOutline} title="Add payment details" key="payment">
            //     Please add your credit card details so we can process your smoov'ed payments<br/>
            //     <IonButton onClick={() => setShowCreditCardForm(true)}>Add credit card</IonButton>
            //   </Notification>
          }
            <IonCol className="dashboard-row-col" size="6">
          { redirectChoices() }
            </IonCol>
            </>
          }
        </IonRow>
      </IonGrid>
    </>
  )
  
  const redirectChoices = () => {
    if('CONTACTING_PROVIDERS' === user.status) {
      return <IonCard color="success" style={{maxWidth:'1000px'}}>
        <IonCardHeader>
          <IonCardTitle><IonIcon icon={checkmark} /> Please contact your providers to update your billing email 
          to <a href="#"  className="underline"
            onClick={event => {navigator.clipboard.writeText(user.billingEmail); present('email address copied', 3000); event.preventDefault();}}><small>{user.billingEmail}</small> <IonIcon icon={copyOutline}/></a></IonCardTitle>
          <br/> Alternatively <a href="#" className="underline" onClick={event => {setView(viewProviders);event.preventDefault();}}>select your providers</a> and sign the authorisation. Then we'll do the hard work for you!
        </IonCardHeader>
      </IonCard>
    } else if('MANUAL_INVOICE_SEND' === user.status) {
      return <IonCard color="success" style={{maxWidth:'1000px'}}>
        <IonCardHeader>
          <IonCardTitle><IonIcon icon={checkmark} /> Please send your bills 
          to <a href="#"  className="underline"
            onClick={event => {navigator.clipboard.writeText(user.billingEmail); present('email address copied', 3000); event.preventDefault();}}><small>{user.billingEmail}</small> <IonIcon icon={copyOutline}/></a></IonCardTitle>
          <br/> Alternatively <a href="#" className="underline" onClick={event => {setView(viewProviders);event.preventDefault();}}>select your providers</a> and sign the authorisation to permanently redirect your bills.
        </IonCardHeader>
      </IonCard>
    } else if(!!user.providers.length && !user.providers.every(provider => provider.status === 'NEW')) {
      return <IonCard color="success" style={{maxWidth:'1000px'}}>
        <IonCardHeader>
          <IonCardTitle><IonIcon icon={checkmark} /> Providers added</IonCardTitle>
        </IonCardHeader>
      </IonCard>
    } else {
      return (
        <Notification
          icon={cloudUploadOutline}
          title="Redirect your bills"
          key="authorisation"
          subTitle="To pay your bills, you need to redirect your bills to Billsmoov. It's easy..."
        >
          <IonButton
            className="item-dashboard-button"
            onClick={() => setShowBillRedirect(true)}
          >
            Redirect bills
          </IonButton>
        </Notification>
      )
    }
  }
  
  useEffect(getHasBills, []);
  
  return ( show && 
    <IonContent>
      {signupInProgress(user) ? signupFLow() :
        <IonContent>
          <PaymentInfo />
          { getNotifications() }
        </IonContent>
      }
    </IonContent>
);}

export default Dashboard;
