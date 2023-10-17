import React, {FC} from "react";
import {PageProps} from "../Page.model";
import {
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonPage,
  IonRow,
  IonTitle,
  IonText,
} from "@ionic/react";
import {Text} from "../../components";
import {BillsHeaderProps, BillsListProps} from "./Bills.model";
import {TextVariant} from "../../components/Text/Text.model";
import WalletIcon from '../../assets/wallet.svg'
import DocumentIcon from '../../assets/document.svg'
import DollarIcon from '../../assets/dollar.svg'
import AlintaIcon from '../../assets/Bills/alinta.svg'
import OriginIcon from '../../assets/Bills/origin.svg'
import TelstraIcon from '../../assets/Bills/telstra.svg'
import InfoIcon from '../../assets/info.svg'
import ArrowRightIcon from '../../assets/arrow-right-bills.svg'
import './Bills.css'

const BillsHeader: BillsHeaderProps[] = [
  {
    title: 'Next payment 14 Sep 2022',
    icon: WalletIcon,
    price: '800',
  },
  {
    title: 'Bills for period',
    icon: DocumentIcon,
    price: '2381',
  },
  {
    title: 'Net Position',
    icon: DollarIcon,
    price: '2381',
  },
]

const BillSList: BillsListProps[] = [
  {
    title: 'Origin',
    icon: OriginIcon,
    price: '250',
    department: 'Electricity',
    status: 'Awaiting approval',
    date: 'Due 15/08/22 '
  },
  {
    title: 'Telstra',
    icon: TelstraIcon,
    price: '125',
    department: 'Internet',
    status: 'Approved',
    date: 'Due 15/08/22 '
  },
  {
    title: 'Alinta',
    icon: AlintaIcon,
    price: '75.15',
    department: 'Gas',
    status: 'Paid',
    date: 'Paid 15/08/22 '
  },
]

const Bills: FC<PageProps> = ({ show } ) => {
  return show && (
    <IonPage>
      <IonHeader className="bills-header">
        <IonGrid>
          <IonRow className="bill-row">
            <IonCol size="12">
              <IonTitle className="bills-header-title">Hello, Jonathan!</IonTitle>
            </IonCol>
            {BillsHeader.map((item: BillsHeaderProps, id: number) => (
              <IonCol size="4" key={id} className="bills-col">
                <IonCard className="bills-card">
                  <IonItem className="bills-item">
                    <IonIcon src={item.icon} className="bills-item-icon" />
                  </IonItem>
                  <IonCardContent className="bills-card-content">
                    <IonCardTitle className="bills-card-title">{item.title}</IonCardTitle>
                    <Text variant={TextVariant.Money} className="bills-card-price">{item.price}</Text>
                  </IonCardContent>
                  <IonIcon src={InfoIcon} className="bills-icon-info" />
                </IonCard>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
      </IonHeader>
      <IonContent className="bills-content">
        <IonItem className="no-border bills-content-filter-wrapper">
          <IonItem
            button
            className="no-border bills-content-filter"
          >
            <IonText className="bills-content-filter-text">
              Sort by
            </IonText>
            <IonIcon src={ArrowRightIcon} className="bills-content-filter-icon" />
          </IonItem>
          <IonItem
            button
            className="no-border bills-content-filter right"
          >
            <IonText className="bills-content-filter-text">
              Filter by
            </IonText>
            <IonIcon src={ArrowRightIcon} className="bills-content-filter-icon" />
          </IonItem>
        </IonItem>
        {BillSList.map((item: BillsListProps) => (
          <IonItem
            button
            detail
            detailIcon={ArrowRightIcon}
            className="bills-content-item"
          >
            <IonIcon src={item.icon} className="bills-content-icon" />
            <IonGrid>
              <IonRow className="bills-content-item-wrapper">
                <IonCol size="12" className="bills-content-header-wrapper">
                  <IonTitle className="bills-content-title">{item.title}</IonTitle>
                  <Text variant={TextVariant.Money} className="bills-content-title text">{item.price}</Text>
                </IonCol>
                <IonCol size="12" className="bills-content-header-wrapper">
                  <IonText className="bills-content-subtitle">
                    <IonText className="bills-content-subtitle-hidden">{item.department} |</IonText> {item.status} | {item.date}
                  </IonText>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonItem>
        ))}
      </IonContent>
    </IonPage>
  )
}

export default Bills
