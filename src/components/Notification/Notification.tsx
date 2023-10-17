// @ts-nocheck
import React, { FC } from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonIcon,
  IonCol,
  IonText,
  IonRow,
  IonItem,
  IonGrid,
  IonCardContent,
} from '@ionic/react';
import cn from "classnames";
import './Notification.css'
import {NotificationProps, NotificationVariant} from "./Notification.model";
import EllipceIcon from '../../assets/Notification/after-ellipce.svg'

const Notification: FC<NotificationProps> = ({
  variant = NotificationVariant.WARNING,
  title,
  subTitle,
  icon,
  children,
  className,
}) => {
  return (
    <IonCard className={cn('notification-card', className, variant )}>
      <IonGrid>
        <IonRow className="item-notification">
          <IonCol size="6" className="item-notification-col">
            <IonCardHeader className="no-padding">
              { icon && <IonCardSubtitle><IonIcon icon={icon} className="notification-icon" /></IonCardSubtitle> }
            </IonCardHeader>
            <IonCardContent className="item-notification-col-wrapper">
              <IonItem className="no-border item-notification-col-item">
                <IonText className="item-notification-text header">
                  {title}
                </IonText>
              </IonItem>
              <IonItem className="no-border item-notification-col-item">
                <IonText className="item-notification-text">
                  {subTitle}
                </IonText>
              </IonItem>
            </IonCardContent>
          </IonCol>
          <IonCol size="6" className="ion-text-end item-notification-children">
            {children}
          </IonCol>
        </IonRow>
      </IonGrid>
      <IonIcon src={EllipceIcon} className="notification-card-icon" />
    </IonCard>
);}

export default Notification;
