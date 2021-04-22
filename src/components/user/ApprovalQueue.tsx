import React, { useState, useEffect } from "react";
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
  IonText,
} from "@ionic/react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUnverifiedUsers,
  getUnverifiedUsers,
} from "../../redux/slices/userSlice";
import * as constants from "../../constants";

export const ApprovalQueue: React.FC = () => {
  const dispatch = useDispatch();
  const [finishedLoading, setFinishedLoading] = useState<boolean>(false);
  useEffect(() => {
    dispatch(fetchUnverifiedUsers());
    setFinishedLoading(true);
  }, []);

  const TextContainerStyle = {
    display: "block",
  };

  const unverifiedUsers = useSelector(getUnverifiedUsers);
  if (unverifiedUsers.length > 0) console.log(unverifiedUsers);

  if (finishedLoading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>User Approval Queue</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Users pending approval</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              {unverifiedUsers.length > 0
                ? unverifiedUsers.map((unvUser, index) => {
                    return (
                      <IonCard key={index}>
                        <IonCardHeader>
                          <IonCardTitle>Email: {unvUser.email}</IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent>
                          <IonText style={TextContainerStyle}>
                            Username: {unvUser.username}
                          </IonText>
                          <br />
                          <IonText style={TextContainerStyle}>
                            RequestedAccess Level: {unvUser.accessLevel}
                          </IonText>
                          <br />
                          <IonText style={TextContainerStyle}>
                            Verified: {String(unvUser.verified)}
                          </IonText>
                          <br />
                          <IonText style={TextContainerStyle}>
                            Approved: {String(unvUser.approved)}
                          </IonText>
                          <br />
                        </IonCardContent>
                      </IonCard>
                    );
                  })
                : ""}
            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonPage>
    );
  } else {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>User Approval Queue</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Users pending approval</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonItem>
                <IonLabel>Fetching Users</IonLabel>
              </IonItem>
              <IonProgressBar type="indeterminate"></IonProgressBar>
            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonPage>
    );
  }
};
