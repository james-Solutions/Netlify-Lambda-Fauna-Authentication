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

export const RegistrationCard: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Registration</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Registration</IonCardTitle>
            <IonCardSubtitle>Enter New User Information:</IonCardSubtitle>
          </IonCardHeader>

          <IonCardContent>Placeholder for register</IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};
