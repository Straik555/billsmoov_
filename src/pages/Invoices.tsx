// @ts-nocheck
import React from 'react';
import { getAuth } from "firebase/auth";
import { userState, errorState, invoiceToApproveState } from '../atoms';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { swapVertical, caretUpOutline, caretDownOutline, checkmark, pencilOutline, copyOutline } from 'ionicons/icons';
import { format, formatISO, parse } from "date-fns";
import CurrencyFormat from 'react-currency-format';
import { useTable, useSortBy } from 'react-table';
import { REST_API_URL } from '../constants/global';
import { ProviderSearch, PaymentInfo } from '../components';
import { handleErrors } from '../utils/handleErrors';
import {
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonIcon,
  IonButton,
  IonModal,
  IonToast,
  useIonToast
} from '@ionic/react';

const Invoices: React.FC = props => {
  
  const {show} = props;
  
  const user = useRecoilValue(userState);
  const setError = useSetRecoilState(errorState);
  const setInvoiceToApprove = useSetRecoilState(invoiceToApproveState);
  
  const [data, setData] = React.useState([]);
  const [unapproveInvoiceId, setUnapproveInvoiceId] = React.useState(null);
  const [showUndoToast, setShowUndoToast] = React.useState(false);
  
  const [present] = useIonToast();

  const getInvoices = () => getAuth().currentUser.getIdToken().then(token => {
    fetch(user._links.invoices.href, {headers: {'Authorization': 'Bearer ' + token}})
      .then(handleErrors)
      .then(invoices => setData(invoices))
      .catch(() => setError('Failed to retrieve your bills.'))});
  
  const downloadInvoice = invoiceId => getAuth().currentUser.getIdToken().then(token =>
      fetch(user._links.invoices.href + '/'+ invoiceId, {headers: {'Authorization': 'Bearer ' + token}})
        .then(handleErrors)
        .then(redirectURL => window.open(redirectURL, '_blank'))
        .catch(() => setError('Failed to download invoice.')));
        
  const approveInvoice = invoiceId => updateInvoice(invoiceId, 'PENDING_PAYMENT')
    .then(() => {
      setUnapproveInvoiceId(invoiceId);
      setShowUndoToast(true);
    });
  
  const unapproveInvoice = () => updateInvoice(unapproveInvoiceId, 'UNVERIFIED');
    
  const updateInvoice = (invoiceId, status) => getAuth().currentUser.getIdToken().then(token =>
    fetch(REST_API_URL + '/invoices/' + invoiceId, {
      method: 'PATCH',
      body: JSON.stringify({status:status}),
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/merge-patch+json'
      }
    })
    .then(getInvoices)
    .catch(() => setError('Failed to update invoice')));
    
  const providerName = row => row.original.provider.name.toLowerCase();
        
  const columns = React.useMemo(
   () => [
     {
        Header: 'ID',
        accessor: 'id',
        Cell: id => <IonButton size="small" onClick={() => downloadInvoice(id.row.original.id)}>{id.row.original.id}</IonButton>,
        maxWidth: '100px',
        disableSortBy: true
     },
     {
       Header: 'Provider',
       accessor: 'provider',
       sortType: (rowA, rowB) => providerName(rowA) > providerName(rowB) ? 1 : providerName(rowB) > providerName(rowA) ? -1 : 0,
      Cell: provider => provider && 
          <div style={{overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>  
            { user.admin &&
              <div style={{float:'left', marginRight:'20px'}}>
                <IonButton color="success" size="small" onClick={() => approveInvoice(provider.row.original.id)}>
                  <IonIcon icon={checkmark} />
                </IonButton>
                <IonButton size="small" onClick={event => {
                    setInvoiceId(provider.row.original.id);
                    setShowProviderSearch(true);
                  }}><IonIcon icon={pencilOutline} />
                </IonButton>
              </div>
            }
            { provider.value &&
              <div>
                <div>
                  <img src={provider.value.logo.replace(/upload/,'upload/w_50,h_50,c_fit').replace(/.svg$/, '.png')} alt="provider_logo"
                    style={{float:'left', marginRight:'10px'}}/>
                </div>
                <div style={{lineHeight:'1rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
                  <div style={{overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{provider.value.name}</div>
                  <small style={{color:'#666', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{provider.value.service}</small>
                </div>
              </div>
            }
          </div>
     },
     {  
       Header: 'User',
       accessor: 'userIdentity',
       maxWidth: '5%',
     },
     {  
       Header: 'Amount',
       accessor: 'total',
        Cell: total => <CurrencyFormat data-field="total" data-id={total.row.original.id} value={total.value} thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} prefix='$' displayType='text' />,
       maxWidth: '15%',
       minWidth: '95px'
     },
     {
       Header: 'Issued',
       accessor: 'receiptDate',
       Cell: date => <div data-field="receiptDate" data-id={date.row.original.id}>{date.value && format(new Date(date.value), 'd MMM')}</div>,
       maxWidth: '10%',
       minWidth: '90px'
     },
     {
       Header: 'Due',
       accessor: 'dueDate',
       Cell: date => <div data-field="dueDate" data-id={date.row.original.id}>{date.value && format(new Date(date.value), 'd MMM')}</div>,
       maxWidth: '10%',
       minWidth: '90px'
     },
     {
       Header: 'From',
       accessor: 'startDate',
       Cell: date => <div data-field="startDate" data-id={date.row.original.id}>{date.value && format(new Date(date.value), 'd MMM')}</div>,
       maxWidth: '10%',
       minWidth: '90px'
     },
     {
       Header: 'To',
       accessor: 'endDate',
       Cell: date => <div data-field="endDate" data-id={date.row.original.id}>{date.value && format(new Date(date.value), 'd MMM')}</div>,
       maxWidth: '10%',
       minWidth: '90px'
     },
     {
       Header: 'Status',
       accessor: 'status',
       maxWidth: '10%',
        Cell: status => <div style={{fontSize:'.8rem'}}>{status.value}</div>,
     },
     {
        Header: 'Invoice #',
        accessor: 'receiptId',
        Cell: receiptId => <div data-field="receiptId" data-id={receiptId.row.original.id} className="option">{receiptId.value}</div>,
        maxWidth: '15%',
     }
   ],
   []
 );
 
 const initialState = { hiddenColumns: user.admin ? [] : ['userIdentity', 'receiptDate', 'startDate', 'endDate', 'receiptId', 'id']};
 

 const invoiceTable = useTable({ columns, data, initialState }, useSortBy);
 
 const {
   headerGroups,
   rows,
   prepareRow
 } = invoiceTable;
  
  React.useEffect(() => show && getInvoices(), [show]);


  //////////////////////////
  // Admin functionality...
  //////////////////////////
  const [invoiceId, setInvoiceId] = React.useState(null);
  const [showProviderSearch, setShowProviderSearch] = React.useState(false);

  var fieldUpdated = false;
  
  const formatValue = (value, field) => {
    let valueTrimmed = value.trim();
    switch(field) {
      case 'provider':
        return valueTrimmed;
      case 'dueDate':
      case 'receiptDate':
      case 'startDate':
      case 'endDate':
        return formatISO(parse(valueTrimmed, 'd/M/yy', new Date()));
      case 'total':
        return valueTrimmed.startsWith('$') ? valueTrimmed.replaceAll('$', '') : valueTrimmed;
      default:
        return valueTrimmed;
    }
  }
  
  const adminUpdate = (id, field, value, element) => {
    if(fieldUpdated) {
      fieldUpdated = false;
        getAuth().currentUser.getIdToken().then(token => {
          try {
            fetch(REST_API_URL + '/invoices/' + id, {
              method: 'PATCH',
              body: JSON.stringify({[field]:formatValue(value, field)}),
              headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/merge-patch+json'
              }
            })
            .then(response => {
              setShowProviderSearch(false);
              if(response.status === 400) element.style.backgroundColor = '#fbb';
            })
            .catch(() => element.style.backgroundColor = '#fbb')
          } catch(error) {
            element.style.backgroundColor = '#fbb';
          }
        });
    }
  }
  
  const updateProvider = provider => {
    fieldUpdated = true;
    adminUpdate(invoiceId, 'provider', provider._links.self.href);
    setData(data.map(invoice => (invoice.id !== invoiceId) ? invoice : {
      ...invoice,
      provider: provider
    }));
  }
  
  React.useEffect(() => {
    if(user.admin) {
      document.querySelectorAll('[data-field]').forEach(element => {
        let field = element.getAttributeNode('data-field').value;
        let id = element.getAttributeNode('data-id').value;
        element.setAttribute('contentEditable', true);
        element.addEventListener('DOMSubtreeModified', () => {fieldUpdated = true;});
        element.addEventListener('click', () => {document.execCommand('selectAll', false, null); element.style.backgroundColor = '';});
        element.addEventListener('focus', () => {document.execCommand('selectAll', false, null); element.style.backgroundColor = '';});
        element.addEventListener('blur', event => adminUpdate(id, field, event.target.innerText, element));
      });
    }
  }, [data]);
  
  React.useEffect(() => setShowProviderSearch(false), [show]);

  return (
    show && 
      <div>
        <PaymentInfo />
        
        { user.admin && <IonModal isOpen={showProviderSearch}><ProviderSearch onSelect={provider => updateProvider(provider)} /></IonModal> }
        
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
          
          { !rows.length && <IonRow><p>No invoices available. To receive invoices contact your provider and change your email address 
            to <a href="#"  className="underline"
            onClick={event => {navigator.clipboard.writeText(user.billingEmail); present('email address copied', 3000); event.preventDefault();}}><small>{user.billingEmail}</small> <IonIcon icon={copyOutline}/></a>
            </p></IonRow> }
          
          { rows.map(row => {
            prepareRow(row);
            return (<IonRow key={row.id} onClick={() => !user.admin && setInvoiceToApprove(row.original)}>
              { row.cells.map(cell => 
                <IonCol {...cell.getCellProps({style: {maxWidth: cell.column.maxWidth, minWidth: cell.column.minWidth, paddingLeft:'20px'}})}>
                  {cell.render('Cell')}
                </IonCol>
              )}
            </IonRow>
          )})}
        </IonGrid>
        
        <IonToast
          isOpen={showUndoToast}
          onDidDismiss={() => setShowUndoToast(false)}
          message="Invoice approved."
          duration={5000}
          buttons={[
          {
            side: 'end',
            text: 'Undo approval',
            handler: unapproveInvoice
          }
        ]}
        />
        
      </div>
  );
}

export default Invoices;
