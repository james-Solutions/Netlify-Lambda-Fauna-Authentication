import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from "@ionic/react";

import { useLocation } from "react-router-dom";
import {
  logInOutline,
  logInSharp,
  personAddOutline,
  personAddSharp,
  homeOutline,
  homeSharp,
  logOutOutline,
  logOutSharp,
} from "ionicons/icons";
import "./Menu.css";

import { getIsAuth, getUser } from "../redux/slices/userSlice";
import { useSelector } from "react-redux";

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const loggedOutAppPages: AppPage[] = [
  {
    title: "Login",
    url: "/user/login",
    iosIcon: logInOutline,
    mdIcon: logInSharp,
  },
  {
    title: "Registration",
    url: "/user/register",
    iosIcon: personAddOutline,
    mdIcon: personAddSharp,
  },
];

const loggedInAppPages: AppPage[] = [
  {
    title: "Home",
    url: "/home",
    iosIcon: homeOutline,
    mdIcon: homeSharp,
  },
  {
    title: "Logout",
    url: "/user/logout",
    iosIcon: logOutOutline,
    mdIcon: logOutSharp,
  },
];

const Menu: React.FC = () => {
  const location = useLocation();
  const isAuth = useSelector(getIsAuth);
  const user = useSelector(getUser);
  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="menu-list">
          <IonListHeader>Semester Schedule Planner</IonListHeader>
          <IonNote>Welcome</IonNote>
          {isAuth === true
            ? loggedInAppPages.map((appPage, index) => {
                return (
                  <IonMenuToggle key={index} autoHide={false}>
                    <IonItem
                      className={
                        location.pathname === appPage.url ? "selected" : ""
                      }
                      routerLink={appPage.url}
                      routerDirection="none"
                      lines="none"
                      detail={false}
                    >
                      <IonIcon
                        slot="start"
                        ios={appPage.iosIcon}
                        md={appPage.mdIcon}
                      />
                      <IonLabel>{appPage.title}</IonLabel>
                    </IonItem>
                  </IonMenuToggle>
                );
              })
            : loggedOutAppPages.map((appPage, index) => {
                return (
                  <IonMenuToggle key={index} autoHide={false}>
                    <IonItem
                      className={
                        location.pathname === appPage.url ? "selected" : ""
                      }
                      routerLink={appPage.url}
                      routerDirection="none"
                      lines="none"
                      detail={false}
                    >
                      <IonIcon
                        slot="start"
                        ios={appPage.iosIcon}
                        md={appPage.mdIcon}
                      />
                      <IonLabel>{appPage.title}</IonLabel>
                    </IonItem>
                  </IonMenuToggle>
                );
              })}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
