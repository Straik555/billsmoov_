import React, { FC, useState } from "react";
import {
  IonContent,
  IonPage,
  IonItem,
  IonIcon,
  IonLabel,
  IonList,
  IonSplitPane,
  IonMenuToggle,
} from '@ionic/react';
import { LayoutProps } from './Layout.model'
import { showSignInState, userState } from '../../atoms'
import './Layout.css'
import {useRecoilValue, useSetRecoilState} from "recoil";
import cn from 'classnames'
import SignOut from '../../assets/Menu/sign-out.svg'
import LogoIcon from '../../assets/logo-default.svg'
import ArrowRightIcon from '../../assets/arrow-right.svg'
import {getAuth, signOut} from "firebase/auth";
import { Menu } from "../index";

const Layout: FC<LayoutProps> = ({ children }) => {

  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const setUser = useSetRecoilState(userState);
  const setShowSignIn = useSetRecoilState(showSignInState);
  const user = useRecoilValue(userState);

  const handleOut = () => signOut(getAuth()).finally(() => {setUser(null); setShowSignIn(true)})

  return (
    <IonContent>
      <IonSplitPane contentId="main">
        {user && (
          <>
            <div id="menu" className={cn('left-layout', { 'active': openMenu })}>
              <IonContent className="layout-wrapper">
                <IonIcon src={LogoIcon} className="logo-menu" />
                <IonList className="menu-list-layout">
                  <Menu onOpen={() => setOpenMenu(false)} />
                </IonList>
                <IonItem
                  button
                  onClick={handleOut}
                  className="menu-item-layout menu-item-layout-bottom"
                >
                  <IonIcon src={SignOut} className="icon-layout-bottom" />
                  <IonLabel className="label-layout">
                    Log out
                  </IonLabel>
                </IonItem>
              </IonContent>
              <IonIcon
                src={ArrowRightIcon}
                className={cn('arrow-layout', { 'active': openMenu })}
                onClick={() => setOpenMenu(!openMenu)}
              />
            </div>
          </>
        )}
        <IonPage id="main" className={cn({ 'main-layout-opacity': openMenu })} onClick={() => setOpenMenu(false)}>
          {children}
        </IonPage>
      </IonSplitPane>
    </IonContent>
  )
}

export default Layout
