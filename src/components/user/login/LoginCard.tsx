import React from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonButton,
} from "@ionic/react";

export const LoginCard: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Login</IonCardTitle>
            <IonCardSubtitle>Enter Login Information:</IonCardSubtitle>
          </IonCardHeader>

          <IonCardContent>Placeholder for login</IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};
