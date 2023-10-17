// @ts-nocheck
import React, { FC, useState } from 'react';
import { getAuth } from "firebase/auth";
import { errorState } from '../../atoms';
import { useSetRecoilState } from 'recoil';
import { handleErrors } from '../../utils/handleErrors';
import { addCircleOutline } from 'ionicons/icons';
import { REST_API_URL } from '../../constants/global';
import {
  IonSearchbar,
  IonList,
  IonItem,
  IonRow,
  IonCol,
  IonIcon,
} from '@ionic/react';

const ProviderSearch: FC = props => {
  
  const {selectedService, clearSelectedService, onSelect} = props;
  
  const setError = useSetRecoilState(errorState);
  
  const [providers, setProviders] = useState([]);
  const [showProviderSearchResults, setShowProviderSearchResults] = useState<boolean>(false);
  
  const searchProvidersByName = searchTerm => {
    getAuth().currentUser.getIdToken().then(token =>
      fetch(REST_API_URL + '/providers/search/findByNameContainingIgnoreCaseOrderByName?name=' + searchTerm, {headers: {'Authorization': 'Bearer ' + token}})
        .then(handleErrors)
        .then(response => {
          setShowProviderSearchResults(!!searchTerm);
          setProviders(response._embedded.providers);
        })
        .catch(() => setError('Failed to search for providers with name ' + searchTerm))
    );
  }
  
  const searchProvidersByService = service => {
    getAuth().currentUser.getIdToken().then(token =>
      fetch(REST_API_URL + '/providers/search/findByServiceOrderByName?service=' + service, {headers: {'Authorization': 'Bearer ' + token}})
        .then(handleErrors)
        .then(response => {
          setShowProviderSearchResults(true);
          setProviders(response._embedded.providers);
        })
        .catch(() => setError('Failed to search for ' + service + ' providers.'))
        .finally(clearSelectedService)
    );
  }
  
  selectedService && searchProvidersByService(selectedService);
  
  return (
      <div style={{position:'fixed', top:'72px', zIndex:'2', width:'100%'}}>
      { <IonSearchbar placeholder='Telstra, Origin, Medibank...'
          onIonChange={term => searchProvidersByName(term.detail.value)}
          onFocus={() => setProviders([])} 
          onIonClear={() => setShowProviderSearchResults(false)} /> }
          
      { showProviderSearchResults &&
        <IonList style={{zIndex:'1001'}}>
          { providers.map( provider => 
            <IonItem key={provider.id} onClick={() => {
              setShowProviderSearchResults(false);
              setProviders([]);
              onSelect(provider)
            }}>
              <IonRow style={{width:'100%'}} className="searchResultItem" >
                <IonCol style={{width:'50px',maxWidth:'50px'}}><img src={provider.logo.replace(/upload/,'upload/h_20').replace(/.svg$/, '.png')} alt="logo"/></IonCol>
                <IonCol>{provider.name} <small>({provider.service})</small></IonCol>
                <IonCol size="auto"><IonIcon icon={addCircleOutline}/></IonCol>
              </IonRow>
            </IonItem>
          )}
        </IonList>
      }
      </div>
  );
}

export default ProviderSearch;
