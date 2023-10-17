// @ts-nocheck
import React from 'react';
import { getAuth } from "firebase/auth";
import { userState, errorState } from '../atoms';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { swapVertical, caretUpOutline, caretDownOutline } from 'ionicons/icons';
import { format } from "date-fns";
import CurrencyFormat from 'react-currency-format';
import { useTable, useSortBy } from 'react-table';
import { PaymentInfo } from '../components';
import { handleErrors } from '../utils/handleErrors';
import {
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonIcon
} from '@ionic/react';

const Payments: React.FC = props => {
  
  const {show} = props;
  
  const user = useRecoilValue(userState);
  const setError = useSetRecoilState(errorState);
  
  const [data, setData] = React.useState([]);

  const getPayments = () => getAuth().currentUser.getIdToken().then(token => {
      fetch(user._links.payments.href + '?sort=date,desc', {headers: {'Authorization': 'Bearer ' + token}})
        .then(handleErrors)
        .then(payments => Promise.all(payments._embedded.payments.map(payment => 
          // get provider for each payment
          fetch(payment._links.provider.href, {headers: {'Authorization': 'Bearer ' + token}})
            .then(handleErrors)
            .then(provider => ({
              ...payment,
              provider : provider
            }))
            .catch(error => ({
              ...payment,
              provider : null
            }))))
        .then(payments => setData(payments)))
        .catch(() => setError('Failed to retrieve your payment history.'));
    })
  
  const columns = React.useMemo(
   () => [
      {
        Header: 'Date',
        accessor: 'date',
        Cell: date => <div>{date.value && format(new Date(date.value), 'dd/MM/yyyy')}</div>,
        maxWidth: '15%',
        minWidth: '120px'
      },
      {
        Header: 'Provider',
        accessor: 'provider',
        sortType: (rowA, rowB) => providerName(rowA) > providerName(rowB) ? 1 : providerName(rowB) > providerName(rowA) ? -1 : 0,
        Cell: provider => provider && 
        <div style={{overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>  
        { provider.value &&
          <div style={{overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{provider.value.name} <small style={{color:'grey'}}>{provider.value.service}</small></div>
        }
        </div>
      },
      {  
        Header: 'Credit',
        id: 'credit',
        accessor: 'amount',
        Cell: amount => (amount.value >= 0) && <div style={{color:'green', width:'100%', textAlign:'end'}}><CurrencyFormat value={amount.value} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} prefix='$' displayType='text'/></div>,
        maxWidth: '15%',
        minWidth: '100px'
      },
      {  
        Header: 'Debit',
        id: 'debit',
        accessor: 'amount',
        Cell: amount => (amount.value < 0) && <div style={{color:'red', width:'100%', textAlign:'end'}}><CurrencyFormat value={amount.value} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} prefix='$' displayType='text' /></div>,
        maxWidth: '15%',
        minWidth: '100px'
      }  
   ],
   []
 );
 
 const initialState = {};

 const invoiceTable = useTable({ columns, data, initialState }, useSortBy);
 
 const {
   headerGroups,
   rows,
   prepareRow
 } = invoiceTable;
  
  React.useEffect(() => show && getPayments(), [show]);

  return (
    show && 
      <div>
        <PaymentInfo />
        
        <IonGrid>
          <IonRow key='header'>
            { headerGroups.map(headerGroup =>
              headerGroup.headers.map(column => 
                <IonCol {...column.getHeaderProps({...column.getSortByToggleProps(), style:{maxWidth: column.maxWidth, minWidth: column.minWidth}})}>
                  <IonItem>
                    <IonLabel>{column.render('Header')}</IonLabel>
                    { !column.disableSortBy && <IonIcon icon={column.isSorted ? (column.isSortedDesc ? caretDownOutline : caretUpOutline) : swapVertical} color={column.isSorted ? 'primary' : 'medium'} size="small" /> }
                  </IonItem>
                </IonCol>
            ))}
          </IonRow>
          { !rows.length && <IonRow><p>No payment data available.</p></IonRow> }
          { rows.map(row => {
            prepareRow(row);
            return (<IonRow key={row.id}>
              { row.cells.map(cell => 
                <IonCol {...cell.getCellProps({style: {maxWidth: cell.column.maxWidth, minWidth: cell.column.minWidth, paddingLeft:'20px'}})}>
                  {cell.render('Cell')}
                </IonCol>
              )}
            </IonRow>
          )})}
        </IonGrid>
        
      </div>
  );
}

export default Payments;
