// @ts-nocheck
import React, { FC, useState } from 'react';
import { userState, errorState, viewState, showBillRedirectState, showPoAState } from '../../../atoms';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { getAuth } from "firebase/auth";
import { viewProviders } from '../../../constants/global';
import {
  IonButton,
  IonSpinner,
  IonRow,
  IonCol,
  IonGrid,
  useIonToast
} from '@ionic/react';
import { NotificationInvoiceList } from "./InvoiceRedirect.model";
import { Notification } from '../../../components'
import CallIcon from '../../../assets/Notification/call.svg'
import EditIcon from '../../../assets/Notification/edit.svg'
import MessageIcon from '../../../assets/Notification/message.svg'
import './InvoiceRedirect.css'

const InvoiceRedirect: FC = () => {
  
  const user = useRecoilValue(userState);
  const setUser = useSetRecoilState(userState);
  const setError = useSetRecoilState(errorState);
  const setView = useSetRecoilState(viewState);
  const showBillRedirect = useRecoilValue(showBillRedirectState);
  const setShowBillRedirect = useSetRecoilState(showBillRedirectState);
  const setShowPoA = useSetRecoilState(showPoAState);
  
  const [option2InProgress, setOption2InProgress] = useState<boolean>(false);
  const [option3InProgress, setOption3InProgress] = useState<boolean>(false);
  
  const [present] = useIonToast();

  const notificationInvoice: NotificationInvoiceList = [
    {
      title: 'Option 1:  Sign authorisation',
      icon: EditIcon,
      subTitle: 'Let us do the hard work for you. Digitally sign the authorisation and we will contact your providers and get them to send your bills directly to us',
      select: () => showProviders
    },
    {
      title: 'Option 2: Update email',
      icon: CallIcon,
      subTitle: 'Contact your service providers and update your contact email to your unique billsmoov email address.',
      select: () => showProviders
    },
    {
      title: 'Option 3: Forward bills',
      icon: MessageIcon,
      subTitle: 'Forward your bills directly to your unique billsmoov email address.',
      subTitle: 'Forward your bills directly to your unique billsmoov email address.',
      select: () => {setOption3InProgress(true);updateUserStatus('MANUAL_INVOICE_SEND')},
      isProgress: true,
    },
  ]

  const showProviders = () => {
    setShowBillRedirect(false);
    setView(viewProviders);
  }
  
  const updateUserStatus = status => {
    getAuth().currentUser.getIdToken().then(token => 
      fetch(user._links.self.href, {
        method: 'PATCH',
        body: JSON.stringify({status:status}),
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/merge-patch+json'
        }
      })
      .then(() => {
        setUser({...user, status:status});
        setShowBillRedirect(false);
      })
      .catch(() => setError('Failed to select option'))
      .finally(() => {setOption2InProgress(false); setOption3InProgress(false)})
    );
  }
  
  return (
      <IonGrid className="no-padding">
        <IonRow>
          {notificationInvoice.map((item: NotificationInvoiceList, id: number) => (
            <IonCol size="6" key={id} className="invoice-icon">
              <Notification
                title={item.title}
                subTitle={item.subTitle}
                icon={item.icon}
              >
                <IonButton onClick={showProviders} className="item-dashboard-button">
                  { item.isProgress && option2InProgress && <IonSpinner name="dots" /> }
                  Select
                </IonButton>
              </Notification>
            </IonCol>
          ))}
          <IonCol size="12" className="invoice-button-wrapper">
            <IonButton onClick={() => setShowBillRedirect(false)} className="invoice-button">I’ll do it later</IonButton>
          </IonCol>
        </IonRow>
    </IonGrid>
  );
}

export default InvoiceRedirect;
