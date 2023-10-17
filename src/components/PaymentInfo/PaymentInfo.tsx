// @ts-nocheck
import React, { FC, useState } from 'react';
import { getAuth } from "firebase/auth";
import { userState, viewState } from '../../atoms';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { format } from "date-fns";
import CurrencyFormat from 'react-currency-format';
import { REST_API_URL, viewPayments, viewInvoices } from '../../constants/global';
import { handleErrors } from '../../utils/handleErrors';
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from '@ionic/react';

const PaymentInfo: FC = () => {
  
  const user = useRecoilValue(userState);
  const setView = useSetRecoilState(viewState);
  
  const [invoiceTotal, setInvoiceTotal] = useState<null, any>(null);
  
  const getInvoiceTotalForMonth = () => getAuth().currentUser.getIdToken().then(token => 
    fetch(REST_API_URL + '/invoices/search/sumTotalInvoicesForCurrentMonthByUserId?userId=' + user.id, {
        headers: {
          'Authorization': 'Bearer ' + token,
          'userId': user.id
        }})
      .then(handleErrors)
      .then(total => setInvoiceTotal(total))
      .catch(() => setInvoiceTotal(null)));
      
  React.useEffect(getInvoiceTotalForMonth, []); 
  
  let paymentInfo = user ? user.paymentInfo : {};
  
  return (
    <div className="summary">
      <IonCard className="summary_item" color="primary">
        <IonCardHeader>
          <IonCardSubtitle>Next payment</IonCardSubtitle>
          <IonCardTitle>
            {paymentInfo.nextPaymentAmount !== null ? <CurrencyFormat value={paymentInfo.nextPaymentAmount} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} prefix='$' displayType='text' /> : '-'}
            {paymentInfo.nextPaymentDate && <span style={{fontSize:'.7rem'}}> on {format(new Date(paymentInfo.nextPaymentDate), 'dd MMM')}</span>}
          </IonCardTitle>
        </IonCardHeader>
      </IonCard>
      <IonCard className="summary_item" color="primary" onClick={() => setView(viewInvoices)} style={{cursor:"pointer"}}>
        <IonCardHeader>
          <IonCardSubtitle>This month's bills</IonCardSubtitle>
          <IonCardTitle>{invoiceTotal !== null ? <CurrencyFormat value={invoiceTotal} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} prefix='$' displayType='text' /> : '-'}</IonCardTitle>
        </IonCardHeader>
      </IonCard>
      <IonCard className="summary_item" color="primary" onClick={() => setView(viewPayments)} style={{cursor:"pointer"}}>
        <IonCardHeader>
          <IonCardSubtitle>Account balance</IonCardSubtitle>
          <IonCardTitle><CurrencyFormat value={paymentInfo.balance} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} prefix='$' displayType='text' /></IonCardTitle>
        </IonCardHeader>
      </IonCard>
    </div>
  );
}

export default PaymentInfo;
