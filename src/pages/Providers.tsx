// @ts-nocheck
import React from 'react';
import { getAuth } from "firebase/auth";
import { userState, errorState, showPoAState, viewState } from '../atoms';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { handleErrors } from '../utils/handleErrors';
import { trashOutline, play, checkmark, addOutline } from 'ionicons/icons';
import { REST_API_URL, viewDashboard } from '../constants/global';
import { ProviderSearch } from '../components';
import {
  IonContent,
  IonCard,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonButton,
  IonProgressBar,
  IonSpinner,
  IonFab
} from '@ionic/react';

const Providers: React.FC = props => {
  
  const {show} = props;
  
  const user = useRecoilValue(userState);
  const setUser = useSetRecoilState(userState);
  const setError = useSetRecoilState(errorState);
  const showPoA = useSetRecoilState(showPoAState);
  const setView = useSetRecoilState(viewState);
  
  const [selectedService, setSelectedService] = React.useState(null);
  
  const addProvider = providerToAdd => {
    if(!user.providers.find(provider => provider.id === providerToAdd.id)) {
      providerToAdd.status = 'NEW';
      setUser({
        ...user,
        providers: [
          ...user.providers,
          providerToAdd
        ]
      });
      getAuth().currentUser.getIdToken().then(token =>
        fetch(REST_API_URL + '/invoiceRedirects/', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user: user._links.self.href,
            provider: providerToAdd._links.self.href,
            status: 'NEW'
          })
        })
        .then(handleErrors)
        .catch(() => {
          setError('Failed to add provider.');
          // undo
          setUser({
            ...user,
            providers: user.providers.filter(provider => provider.id !== providerToAdd.id) 
          });
        })
      );
    }
  }
  
  const removeProvider = providerToRemove => {
    setUser({
      ...user,
      providers: user.providers.filter(provider => provider.id !== providerToRemove.id)
    });
    getAuth().currentUser.getIdToken().then(token =>
      fetch(REST_API_URL + '/invoiceRedirects/' + user.id + '_' + providerToRemove.id, {
          method:'DELETE',
          headers: {'Authorization': 'Bearer ' + token}
        })
        .then(handleErrors)
        .catch(() => {
          setError('Failed to remove provider.');
          // undo remove
          setUser({
            ...user,
            providers: user.providers.push(providerToRemove)
          });
        })
    );
  }
  
  const progressValue = status => {
    switch(status) {
      case 'NEW': return .25
      case 'SIGNED': return .5
      case 'REQUESTED': return .75
      case 'OK': return 1
      default: return 0
    }
  }
  
  const addServiceRow = service => (
    <IonCard style={{marginTop:'20px'}}>
      <IonGrid>
        <IonRow>
          <IonCol style={{fontSize:'1rem',color:'#333',display:'flex', alignItems:'center'}}>{service}</IonCol>
          <IonCol size="auto">
            <IonButton fill="clear" onClick={() => setSelectedService(service)}>
              { service === selectedService ? <IonSpinner name="dots"/> : <span>Add provider <IonIcon icon={addOutline} /></span>}
            </IonButton>
          </IonCol>
        </IonRow>
        { user.providers.filter(provider => service === provider.service).map(provider => insertProviderRow(provider)) }
      </IonGrid>
    </IonCard>
  );
  
  const insertProviderRow = provider => (
    <IonRow key={provider.id} style={{borderTop:'1px solid #ddd', marginTop:'10px', padding:'10px'}}>
      <IonCol size="auto" style={{maxWidth:'100px', maxHeight:'100px', display:'flex', alignItems:'center', justifyContent:'center'}}>
        <img src={provider.logo.replace(/upload/,'upload/w_60,h_60,c_fit').replace(/.svg$/, '.png')} alt="logo"/>
      </IonCol>
      <IonCol>
        <IonRow>
          <IonCol>
            <span style={{fontSize:'1rem',color:'black'}}>{provider.name}</span>
          </IonCol>
          <IonCol size="auto">
            <IonIcon icon={trashOutline} size="small" onClick={() => removeProvider(provider)}/>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonProgressBar color="primary" value={progressValue(provider.status)}></IonProgressBar>
            <small>status: <span style={{textTransform:'lowercase'}}>{provider.status}</span> {'OK' === provider.status && <IonIcon icon={checkmark} size="small" color="success" /> }</small>
          </IonCol>
        </IonRow>
      </IonCol>
    </IonRow> );
  
  return (
    show && <IonContent>
      <div style={{backgroundColor:'#fafafa', margin:'70px 0px 100px 0px'}}>

        <ProviderSearch onSelect={provider => addProvider(provider)} selectedService={selectedService} clearSelectedService={() => setSelectedService(null)}/>
  
        { addServiceRow('Electricity') }
        { addServiceRow('Gas') }
        { addServiceRow('Mobile') }
        { addServiceRow('Fixed Line') }
        { addServiceRow('Internet') }
        { addServiceRow('Health Insurance') }
        { addServiceRow('Auto Insurance') }
        { addServiceRow('Home/general insurance') }
  
      </div>
      
      <IonFab vertical="bottom" horizontal="start" slot="fixed">
        <IonButton onClick={() => showPoA(true)} disabled={!user.providers.some(provider => provider.status === 'NEW')}><IonIcon icon={play} /> Sign authorisation</IonButton>
        <IonButton color="light" onClick={() => setView(viewDashboard)}>Cancel</IonButton>
      </IonFab>
    </IonContent>
  );
}

export default Providers;
