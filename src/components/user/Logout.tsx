import React from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonProgressBar,
} from "@ionic/react";
import { Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getIsAuth, logOutUser } from "../../redux/slices/serverSlice";

export const Logout: React.FC = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(getIsAuth);
  dispatch(logOutUser());
  if (isAuth === false) {
    return <Redirect to="/user/login" />;
  } else {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Logout</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Logging Out...</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonProgressBar type="indeterminate"></IonProgressBar>
            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonPage>
    );
  }
};
