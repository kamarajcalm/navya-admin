import React, { useState } from 'react';
import {IonMenu, IonContent, IonList, IonItem, IonIcon, IonLabel, IonMenuToggle } from '@ionic/react';
import { useLocation,withRouter } from 'react-router-dom';
import getLoggedInRoutes from '../../routes';
import './styles.scss';

const SideMenu = () => {   
    const loggedInRoutes = getLoggedInRoutes();
    const location = useLocation();
    return (
        <IonMenu contentId="main" side="start">
            <IonContent>
                <IonList>
                {loggedInRoutes.tabs.map((appPage, index) => {
                    return (
                    <IonMenuToggle key={index} autoHide={false}>
                        <IonItem className={location.pathname === appPage.path ? 'selected' : ''} routerLink={appPage.path} routerDirection="none" lines="none" detail={false}>
                            <IonIcon icon={appPage.icon} className={`icon-center ${appPage.icon}`}/>
                            <IonLabel className='sub-menu-label'>{appPage.label}</IonLabel>
                        </IonItem>
                    </IonMenuToggle>
                    );
                })} 
                </IonList>
            </IonContent>
        </IonMenu>
    );
} 

export default withRouter(SideMenu);