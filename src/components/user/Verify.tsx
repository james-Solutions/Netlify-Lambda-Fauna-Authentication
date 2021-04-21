import React, { useState, useEffect } from "react";
import { Redirect, RouteComponentProps } from "react-router-dom";
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
  IonProgressBar,
} from "@ionic/react";
import { useDispatch, useSelector } from "react-redux";
import {
  getVerificationCode,
  fetchVerificationCode,
  verifyVerificationCode,
  getVerificationError,
  getVerificationErrorMessage,
  getVerificationSuccess,
} from "../../redux/slices/userSlice";

interface MatchParams {
  email: string;
}

interface Props extends RouteComponentProps<MatchParams> {}

export const Verify: React.FC<Props> = (props: Props) => {
  const [finishedLoading, setFinishedLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchVerificationCode({ email: props.match.params.email }));
    setFinishedLoading(true);
  }, []);

  const verificationCode = useSelector(getVerificationCode);
  const [inputCode, setInputCode] = useState<string>();

  const btnCodeSubmitHandler = (event: Event) => {
    event.preventDefault();
    if (inputCode === undefined) return;
    const parsedInputCode = parseInt(inputCode);
    if (!isNaN(parsedInputCode)) {
      if (parsedInputCode === verificationCode) {
        dispatch(
          verifyVerificationCode({
            email: props.match.params.email,
            code: parsedInputCode,
          })
        );
      } else {
        console.log("does not match");
      }
    }
  };
  if (finishedLoading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Verify Account</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Verifying {props.match.params.email}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonItem>
                <IonLabel position="floating">Input Code:</IonLabel>
                <IonInput
                  value={inputCode}
                  onIonChange={(event) => setInputCode(event.detail.value!)}
                  type="text"
                  required={true}
                ></IonInput>
              </IonItem>
              <IonButton
                expand="block"
                type="submit"
                onClick={(event: any) => {
                  btnCodeSubmitHandler(event);
                }}
              >
                Submit Code
              </IonButton>
            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonPage>
    );
  } else {
    return null;
  }
};
