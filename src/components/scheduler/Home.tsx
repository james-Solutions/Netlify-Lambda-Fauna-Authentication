import React, { useState } from "react";
import { useHistory } from "react-router-dom";
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
  IonItem,
  IonLabel,
  IonButton,
  IonInput,
  IonToast,
} from "@ionic/react";
import { getIsAuth, getUser } from "../../redux/slices/serverSlice";
import { useDispatch, useSelector } from "react-redux";

export const Home: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const isAuth = useSelector(getIsAuth);
  const user = useSelector(getUser);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
          <IonCardHeader>Welcome {user.username}</IonCardHeader>
          <IonCardContent>
            Authentication: {isAuth ? "Authenticated" : "Not Authenticated"}
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};
