import React, { useState } from "react";
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
  IonRadioGroup,
  IonListHeader,
  IonRadio,
  IonItemDivider,
  IonToast,
} from "@ionic/react";

export const RegistrationCard: React.FC = () => {
  const [email, setEmail] = useState<string>();
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [verifyPassword, setVerifyPassword] = useState<string>();
  const [selected, setSelected] = useState<string>("Student");
  const [inputToastError, setInputToastError] = useState(false);

  const registrationBtnHandler = (event: Event) => {
    if (
      email === undefined ||
      email === "" ||
      username === undefined ||
      username === "" ||
      password === undefined ||
      password === "" ||
      verifyPassword === undefined ||
      verifyPassword === ""
    ) {
      // setShowToastError(true);
      setInputToastError(true);
    } else {
      // Nothing is sanitized!!!
      setInputToastError(false);
      console.log("-".repeat(40));
      console.log("New User Registration Request:");
      console.log(`Email: ${email} | Username: ${username}`);
      console.log(`Password: ${password} | Verify: ${verifyPassword}`);
      console.log(`Requested Access Level: ${selected}`);
      console.log("-".repeat(40));
    }
  };

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
            <IonCardTitle>Enter New User Information:</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {/* Start basic user info */}
            <IonItem>
              <IonLabel position="floating">Email</IonLabel>
              <IonInput
                value={email}
                onIonChange={(event) => setEmail(event.detail.value!)}
                type="email"
                pattern="email"
                autocomplete="email"
                required={true}
              ></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Username</IonLabel>
              <IonInput
                value={username}
                onIonChange={(event) => setUsername(event.detail.value!)}
                required={true}
              ></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Password</IonLabel>
              <IonInput
                value={password}
                onIonChange={(event) => setPassword(event.detail.value!)}
                type="password"
                pattern="password"
                autocomplete="new-password"
                required={true}
              ></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Verify Password</IonLabel>
              <IonInput
                value={verifyPassword}
                onIonChange={(event) => setVerifyPassword(event.detail.value!)}
                type="password"
                pattern="password"
                autocomplete="new-password"
                required={true}
              ></IonInput>
            </IonItem>
            {/* End Basic User Information */}
            {/* Start Access Level Radio Group */}
            <IonRadioGroup
              value={selected}
              onIonChange={(e) => setSelected(e.detail.value)}
            >
              <IonListHeader>
                <IonLabel>Requested Access Level</IonLabel>
              </IonListHeader>

              <IonItem>
                <IonLabel>Student</IonLabel>
                <IonRadio slot="start" value="Student" />
              </IonItem>

              <IonItem>
                <IonLabel>Administrator</IonLabel>
                <IonRadio slot="start" value="Administrator" />
              </IonItem>

              <IonItem>
                <IonLabel>Root</IonLabel>
                <IonRadio slot="start" value="Root" />
              </IonItem>
            </IonRadioGroup>
            <IonItemDivider>Your Requested Access Level:</IonItemDivider>
            <IonItem>{selected ?? "(none selected"}</IonItem>
            {/* End Access Level Radio Group */}
            {/* Registration Submit Button */}
            <IonButton
              expand="block"
              type="submit"
              onClick={(event: any) => {
                registrationBtnHandler(event);
              }}
            >
              Submit Registration
            </IonButton>
            {/* End Content */}
          </IonCardContent>
        </IonCard>
        <IonToast
          isOpen={inputToastError}
          onDidDismiss={() => setInputToastError(false)}
          message="Please enter all information."
          duration={2500}
        />
      </IonContent>
    </IonPage>
  );
};
