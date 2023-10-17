import React, { FC, useState } from "react";
import {
  IonButton,
  IonCol,
  IonGrid,
  IonInput,
  IonLabel,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonTitle
} from "@ionic/react";
import cn from "classnames";

const Profile: FC = () => {
  const [firstName, setFirstName] = useState<string>('')
  const [firstAddress, setFirstAddress] = useState<string>('')
  const [lastAddress, setLastAddress] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [contactNumber, setContactNumber] = useState<string>('')
  const [city, setCity] = useState<string>('')
  const [region, setRegion] = useState<string>('')
  const [postcode, setPostcode] = useState<string>('')
  const [disabled, setDisabled] = useState<boolean>(true)

  return (
    <IonGrid>
      <IonRow className="settings-row">
        <IonCol size="6" className="settings-col half-left">
          <IonTitle className="settings-col-title">Personal Information</IonTitle>
          <IonRow>
            <IonCol size="6" className="settings-col first">
              <IonLabel className="settings-content-label">First Name:</IonLabel>
              <IonInput
                className="settings-content-input"
                onIonChange={(event) => setFirstName(event.detail.value)}
                value={firstName}
                disabled={disabled}
                type="text"
                required
              />
            </IonCol>
            <IonCol size="6" className="settings-col last">
              <IonLabel className="settings-content-label half-right">Last Name:</IonLabel>
              <IonInput
                className="settings-content-input "
                onIonChange={(event) => setLastName(event.detail.value)}
                value={lastName}
                disabled={disabled}
                type="text"
                required
              />
            </IonCol>
            <IonCol size="12" className="settings-col">
              <IonLabel className="settings-content-label">Email:</IonLabel>
              <IonInput
                className="settings-content-input"
                onIonChange={(event) => setEmail(event.detail.value)}
                value={email}
                disabled={disabled}
                type="email"
                required
              />
            </IonCol>
            <IonCol size="12" className="settings-col">
              <IonLabel className="settings-content-label">Contact Number:</IonLabel>
              <IonInput
                className="settings-content-input"
                onIonChange={(event) => setContactNumber(event.detail.value)}
                value={contactNumber}
                disabled={disabled}
                type="email"
                required
              />
            </IonCol>
          </IonRow>
        </IonCol>
        <IonCol size="6" className="settings-col half-right">
          <IonTitle className="settings-col-title">Address</IonTitle>
          <IonRow>
            <IonCol size="12" className="settings-col">
              <IonLabel className="settings-content-label">Address Line 1:</IonLabel>
              <IonInput
                className="settings-content-input"
                onIonChange={(event) => setFirstAddress(event.detail.value)}
                value={firstAddress}
                type="text"
                disabled={disabled}
                required
              />
            </IonCol>
            <IonCol size="12" className="settings-col">
              <IonLabel className="settings-content-label">Address Line 2:</IonLabel>
              <IonInput
                className="settings-content-input"
                onIonChange={(event) => setLastAddress(event.detail.value)}
                value={lastAddress}
                type="text"
                disabled={disabled}
                required
              />
            </IonCol>
            <IonCol size="6" className="settings-col first">
              <IonLabel className="settings-content-label">City:</IonLabel>
              <IonInput
                className="settings-content-input"
                onIonChange={(event) => setCity(event.detail.value)}
                value={city}
                type="text"
                disabled={disabled}
                required
              />
            </IonCol>
            <IonCol size="6" className="settings-col last">
              <IonLabel className="settings-content-label">State:</IonLabel>
              <IonSelect
                interface="popover"
                value={region}
                className={cn('settings-content-input', { 'disabled': disabled })}
                onIonChange={(event) => setRegion(event.detail.value)}
                disabled={disabled}
              >
                <IonSelectOption value="queensland">Queensland</IonSelectOption>
              </IonSelect>
            </IonCol>
            <IonCol size="12" className="settings-col">
              <IonLabel className="settings-content-label">Postcode:</IonLabel>
              <IonInput
                className="settings-content-input "
                onIonChange={(event) => setPostcode(event.detail.value)}
                value={postcode}
                type="text"
                disabled={disabled}
                required
              />
            </IonCol>
            {disabled ? (
              <IonCol size="6" className="settings-col first">
                <IonButton onClick={() => setDisabled(false)} className="settings-content-button">
                  Edit
                </IonButton>
              </IonCol>
            ) : (
              <>
                <IonCol size="6" className="settings-col first">
                  <IonButton onClick={() => setDisabled(true)} className="settings-content-button">
                    Save
                  </IonButton>
                </IonCol>
                <IonCol size="6" className="settings-col last">
                  <IonButton onClick={() => setDisabled(true)} className="settings-content-button cancel">
                    Cancel
                  </IonButton>
                </IonCol>
              </>
            )}
          </IonRow>
        </IonCol>
      </IonRow>
    </IonGrid>
  )
}

export default Profile
