import React, { FC, useState } from "react";
import { ItemListProps } from "./Settings.model";
import {
  IonPage,
  IonItem,
  IonCard,
  IonLabel,
  IonIcon,
  IonContent,
  IonText,
} from "@ionic/react";
import Profile from "./Profile";
import PaymentDetails from "./PaymentDetails";
import { PageProps } from "../Page.model";
import ArrowIcon from '../../assets/arrow-right-settings.svg'
import ProfileActiveIcon from '../../assets/profile-active.svg'
import ProfileIcon from '../../assets/profile.svg'
import UploadIcon from '../../assets/upload.svg'
import PaymentActiveIcon from '../../assets/Menu/payment-active.svg'
import PaymentIcon from '../../assets/Menu/payment.svg'
import './Settings.css'
import cn from "classnames";

const itemList: ItemListProps[] = [
  {
    title: 'Profile',
    icon: ProfileIcon,
    iconActive: ProfileActiveIcon,
  },
  {
    title: 'Payment Details',
    icon: PaymentIcon,
    iconActive: PaymentActiveIcon,
  },
  {
    title: 'Upload Bills',
    icon: UploadIcon,
    iconActive: UploadIcon,
  },
]

const Settings: FC<PageProps> = ({ show }) => {
  const [activeTab, setActiveTab] = useState<string>(itemList[0].title)

  const contentRender = () => {
    switch (activeTab) {
      case 'Profile':
        return <Profile />
      case 'Payment Details':
        return <PaymentDetails />
      case 'Upload Bills':
        return <p>Upload Bills</p>
    }
  }

  return show && (
    <IonPage className="settings-wrapper">
      <IonItem className="no-border settings-header">
        <IonText className="settings-header-text">
          Settings
        </IonText>
      </IonItem>
      <IonCard className="settings-wrapper-card">
        {itemList.map((item: ItemListProps) => (
          <IonItem
            button
            detail
            detailIcon={ArrowIcon}
            className="settings-item no-p-start"
            key={item.title}
            onClick={() => setActiveTab(item.title)}
          >
            <IonIcon src={item.title === activeTab ? item.iconActive : item.icon} className="settings-icon" />
            <IonLabel className={cn('settings-item-label', { 'active': item.title === activeTab })}>
              {item.title}
            </IonLabel>
          </IonItem>
        ))}
      </IonCard>
      <IonContent className="settings-content">
        {contentRender()}
      </IonContent>
    </IonPage>
  )
}

export default Settings
