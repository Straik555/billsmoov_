import React, { FC, useState } from "react";
import {IonButton, IonCol, IonGrid, IonInput, IonLabel, IonRow} from "@ionic/react";

const PaymentDetails: FC = () => {
  const [nameCard, setNameCard] = useState<string>('')
  const [cardNumber, setCardNumber] = useState<string>('')
  const [expiry, setExpiry] = useState<string>('')
  const [numberCVV, setNumberCVV] = useState<string>('')

  return (
    <IonGrid>
      <IonRow className="settings-row">
        <IonCol size="4" className="settings-col payment">
          <IonRow>
            <IonCol size="12" className="settings-col">
              <IonLabel className="settings-col-title">Name on card</IonLabel>
              <IonInput
                className="settings-content-input"
                onIonChange={(event) => setNameCard(event.detail.value)}
                value={nameCard}
                type="text"
                required
              />
            </IonCol>
            <IonCol size="12" className="settings-col">
              <IonLabel className="settings-col-title">Card Number</IonLabel>
              <IonInput
                className="settings-content-input"
                onIonChange={(event) => setCardNumber(event.detail.value)}
                value={cardNumber}
                type="text"
                required
              />
            </IonCol>
            <IonCol size="6" className="settings-col first">
              <IonLabel className="settings-col-title">Expiry</IonLabel>
              <IonInput
                className="settings-content-input"
                onIonChange={(event) => setExpiry(event.detail.value)}
                value={expiry}
                type="text"
                required
              />
            </IonCol>
            <IonCol size="6" className="settings-col last">
              <IonLabel className="settings-col-title half-right">CVV</IonLabel>
              <IonInput
                className="settings-content-input "
                onIonChange={(event) => setNumberCVV(event.detail.value)}
                value={numberCVV}
                type="text"
                required
              />
            </IonCol>
            <IonCol size="7" className="settings-col first">
              <IonButton onClick={() => console.log('edit')} className="settings-content-button payment">
                Edit
              </IonButton>
            </IonCol>
          </IonRow>
        </IonCol>
      </IonRow>
    </IonGrid>
  )
}

export default PaymentDetails
