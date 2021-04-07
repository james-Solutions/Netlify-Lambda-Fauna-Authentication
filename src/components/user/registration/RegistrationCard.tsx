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
  IonRadioGroup,
  IonListHeader,
  IonRadio,
  IonItemDivider,
  IonToast,
} from "@ionic/react";
import { useSelector, useDispatch } from "react-redux";
import {
  sendRegistration,
  sendRegistrationAsync,
} from "../../../redux/slices/serverSlice";

export const RegistrationCard: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [email, setEmail] = useState<string>();
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [verifyPassword, setVerifyPassword] = useState<string>();
  const [selected, setSelected] = useState<string>("Student");

  const [inputToastError, setInputToastError] = useState<boolean>(false);
  const [
    registrationSuccessfulToast,
    setRegistrationSuccessfulToast,
  ] = useState<boolean>(false);
  const [showEmailError, setShowEmailError] = useState<boolean>(false);
  const [showPasswordError, setShowPasswordError] = useState<boolean>(false);
  const [
    showPasswordsNotMatchError,
    setShowPasswordsNotMatchError,
  ] = useState<boolean>(false);
  const [showUsernameError, setShowUsernameError] = useState<boolean>(false);

  const registrationBtnHandler = (event: Event) => {
    if (
      showEmailError === false &&
      showUsernameError === false &&
      showPasswordError === false &&
      showPasswordsNotMatchError === false &&
      email !== undefined &&
      email !== "" &&
      username !== undefined &&
      username !== "" &&
      password !== undefined &&
      password !== "" &&
      verifyPassword !== undefined &&
      verifyPassword !== ""
    ) {
      // Everything is sanitized!!!
      setInputToastError(false);
      dispatch(
        sendRegistrationAsync({
          username: username,
          email: email,
          password: password,
          accessLevel: selected,
        })
      );
      setRegistrationSuccessfulToast(true);
      history.push("/user/login");
      clearAllInput();
    } else {
      setInputToastError(true);
    }
  };

  // Generic email expression
  const emailExpress = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  // 8 to 15 characters which contain at least one lowercase letter,
  // one uppercase letter, one numeric digit, and one special character
  const passwordExpress = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
  // Uppercase, lowercase and numbers are allowed for username
  const usernameExpress = /^[a-zA-Z0-9]+$/;

  const emailInputHandler = (inputEmail: string) => {
    setEmail(inputEmail);
    if (email !== undefined) {
      if (emailExpress.test(inputEmail)) {
        setShowEmailError(false);
      } else {
        setShowEmailError(true);
      }
    }
  };

  const usernameInputHandler = (inputUsername: string) => {
    setUsername(inputUsername);
    if (username !== undefined) {
      if (usernameExpress.test(inputUsername)) {
        setShowUsernameError(false);
      } else {
        setShowUsernameError(true);
      }
    }
  };

  const passwordInputHandler = (inputPassword: string) => {
    setPassword(inputPassword);
    if (password !== undefined) {
      if (passwordExpress.test(inputPassword)) {
        setShowPasswordError(false);
      } else {
        setShowPasswordError(true);
      }
    }
  };

  const verifyPasswordInputHandler = (inputVerifyPassword: string) => {
    setVerifyPassword(inputVerifyPassword);
    if (verifyPassword !== undefined && password !== undefined) {
      if (password !== inputVerifyPassword) {
        setShowPasswordsNotMatchError(true);
      } else {
        setShowPasswordsNotMatchError(false);
      }
    }
  };

  const clearAllInput = () => {
    setEmail("");
    setUsername("");
    setPassword("");
    setVerifyPassword("");
    setSelected("Student");
  };

  const errorStyle = {
    color: "red",
    padding: "0.5rem",
    fontStyle: "italic",
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
                onIonChange={(event) => emailInputHandler(event.detail.value!)}
                type="email"
                pattern="email"
                autocomplete="email"
                required={true}
              ></IonInput>
            </IonItem>
            {showEmailError ? (
              <div style={errorStyle}>Invalid Email</div>
            ) : (
              <div />
            )}
            <IonItem>
              <IonLabel position="floating">Username</IonLabel>
              <IonInput
                value={username}
                onIonChange={(event) =>
                  usernameInputHandler(event.detail.value!)
                }
                required={true}
              ></IonInput>
            </IonItem>
            {showUsernameError ? (
              <div style={errorStyle}>
                Invalid Username, may only contain letters and digits
              </div>
            ) : (
              <div />
            )}
            <IonItem>
              <IonLabel position="floating">Password</IonLabel>
              <IonInput
                value={password}
                onIonChange={(event) =>
                  passwordInputHandler(event.detail.value!)
                }
                type="password"
                pattern="password"
                autocomplete="new-password"
                required={true}
              ></IonInput>
            </IonItem>
            {showPasswordError ? (
              <div style={errorStyle}>
                Invalid Password. Password must be 8 to 15 characters which
                contain at least one lowercase letter, one uppercase letter, one
                numeric digit, and one special character
              </div>
            ) : (
              <div />
            )}
            <IonItem>
              <IonLabel position="floating">Verify Password</IonLabel>
              <IonInput
                value={verifyPassword}
                onIonChange={(event) =>
                  verifyPasswordInputHandler(event.detail.value!)
                }
                type="password"
                pattern="password"
                autocomplete="new-password"
                required={true}
              ></IonInput>
            </IonItem>
            {showPasswordsNotMatchError ? (
              <div style={errorStyle}>
                Passwords do <u>NOT</u> match
              </div>
            ) : (
              <div />
            )}
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
          message="Please enter all information and in a valid format."
          duration={2500}
        />
        <IonToast
          isOpen={registrationSuccessfulToast}
          onDidDismiss={() => setRegistrationSuccessfulToast(false)}
          message="Registration Successful!"
          duration={2500}
        />
      </IonContent>
    </IonPage>
  );
};
