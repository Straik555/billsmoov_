import React, { FC, useState } from "react";
import { IonIcon, IonItem, IonLabel, IonMenuToggle } from "@ionic/react";
import cn from "classnames";
import { viewAccount, viewDashboard, viewSettings, viewBills } from "../../constants/global";
import HomeIcon from "../../assets/Menu/home.svg";
import BillsIcon from "../../assets/Menu/bills.svg";
import BillsActiveIcon from "../../assets/Menu/bills-active.svg";
import PaymentIcon from "../../assets/Menu/payment.svg";
import PaymentActiveIcon from "../../assets/Menu/payment-active.svg";
import ProvidersIcon from "../../assets/Menu/providers.svg";
import SettingsIcon from "../../assets/Menu/settings.svg";
import OffersIcon from "../../assets/Menu/offers.svg";
import SettingsActiveIcon from "../../assets/Menu/settings-active.svg";
import { MenuProps, Page } from "./Menu.model";
import { useSetRecoilState } from "recoil";
import { viewState } from "../../atoms";

const pages: Page[] = [
  { title: 'Home', path: viewDashboard, icon: HomeIcon, activeIcon: HomeIcon },
  { title: 'Bills', path: viewBills, icon: BillsIcon, activeIcon: BillsActiveIcon },
  { title: 'Payment', path: viewAccount, icon: PaymentIcon, activeIcon: PaymentActiveIcon },
  { title: 'Providers', path: viewAccount, icon: ProvidersIcon, activeIcon: ProvidersIcon },
  { title: 'Settings', path: viewSettings, icon: SettingsIcon, activeIcon: SettingsActiveIcon },
  { title: 'Offers', path: viewAccount, icon: OffersIcon, activeIcon: OffersIcon },
];

const Menu: FC<MenuProps> = ({ onOpen }) => {
  const [activePage, setActivePage] = useState<string>(pages[0].title);

  const setView = useSetRecoilState(viewState)

  const navigateToPage = (page: Page) => {
    setView(page.path)
    setActivePage(page.title);
    onOpen()
  }

  return (
    <>
      {
        pages?.map((page: Page) => {
          const activeItem = page.title === activePage
          return (
            <IonMenuToggle key={page.title} auto-hide="false">
              <IonItem
                button
                onClick={() => navigateToPage(page)}
                className="menu-item-layout"
              >
                <IonIcon src={activeItem ? page.activeIcon : page.icon} className="icon-layout" />
                <IonLabel className={cn('label-layout', { 'active': activeItem })}>
                  {page.title}
                </IonLabel>
              </IonItem>
            </IonMenuToggle>
          )
        })
      }
    </>
  )
}

export default Menu
