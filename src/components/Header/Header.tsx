// @ts-nocheck
import React from 'react';
import { userState, viewState, showSignInState } from '../../atoms';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { person } from 'ionicons/icons';
import { viewDashboard, viewAccount, viewInvoices, viewProviders, viewPayments } from '../../constants/global';
import { signupInProgress } from '../../utils/signupInProgress';
import {
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
} from '@ionic/react';

const Header: React.FC = () => {
  
  const user = useRecoilValue(userState);
  const setView = useSetRecoilState(viewState);
  
  const menuItems = () => {
    let tabs = [];
    tabs.unshift(
      <IonCol key="home" className="optionalMenuButton">
        <IonButton onClick={() => setView(viewDashboard)} color="light" size="small" disabled={!user}>
          Dashboard
        </IonButton>
      </IonCol>
    );
    tabs.push(
      <IonCol key="bills">
        <IonButton onClick={() => setView(viewInvoices)} color="light" size="small" disabled={signupInProgress(user)}>
          Bills
        </IonButton>
      </IonCol>);
    tabs.push(
      <IonCol key="payments" className="optionalMenuButton">
        <IonButton onClick={() => setView(viewPayments)} color="light" size="small" disabled={signupInProgress(user)}>
          Payments
        </IonButton>
      </IonCol>);
    tabs.push(
      <IonCol key="providers">
        <IonButton onClick={() => setView(viewProviders)} color="light" size="small" disabled={signupInProgress(user)}>
          Providers
        </IonButton>
      </IonCol>);
    tabs.push(
      <IonCol key="account" size="auto">
        <IonButton onClick={() => setView(viewAccount)} color="primary" size="small" disabled={!user}>
          <IonIcon icon={person} color="light" />
        </IonButton>
      </IonCol>
    );
    return tabs;
  } 
  
  return (
    <header id="header">
      <div id="logo" onClick={() => setView(viewDashboard)} />

      <nav id="navigation">
   		<IonGrid>
        <IonRow>
          { menuItems() }
        </IonRow>
      </IonGrid>
    </nav>
   </header>
);}

export default Header;
