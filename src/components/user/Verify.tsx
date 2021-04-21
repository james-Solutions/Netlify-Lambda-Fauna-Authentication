import React, { useState, useEffect } from "react";
import { Redirect, RouteComponentProps, Link } from "react-router-dom";
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
  getVerificationSending,
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

  const sendingVerification = useSelector(getVerificationSending);
  const verificationSuccess = useSelector(getVerificationSuccess);
  const verificationCode = useSelector(getVerificationCode);
  const errorMessage = useSelector(getVerificationErrorMessage);
  const error = useSelector(getVerificationError);
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
  if (finishedLoading && verificationSuccess === false) {
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
                  disabled={sendingVerification || error}
                ></IonInput>
              </IonItem>
              {sendingVerification === true ? (
                <IonProgressBar type="indeterminate" />
              ) : (
                <div />
              )}
              {error === true ? (
                <IonItem>
                  <IonLabel color="danger">{errorMessage}</IonLabel>
                </IonItem>
              ) : (
                <div />
              )}
              <IonButton
                expand="block"
                type="submit"
                disabled={sendingVerification || error}
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
  } else if (finishedLoading && verificationSuccess === true) {
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
              <IonCardTitle>
                Verification for {props.match.params.email} Successful
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonItem>
                Your account is now verified. If it is approved as well, you may
                login{" "}
                <a style={{ display: "inline-block" }} href="/user/login">
                  here
                </a>
              </IonItem>
            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonPage>
    );
  } else {
    return null;
  }
};
