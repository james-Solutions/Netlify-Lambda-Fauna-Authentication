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
  IonIcon,
} from "@ionic/react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUnverifiedUsers,
  getUnverifiedUsers,
} from "../../redux/slices/userSlice";
import * as constants from "../../constants";
import { checkmark, checkmarkCircle, closeCircle } from "ionicons/icons";

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

  const approveBtnHandler = (index: number) => {
    console.log(unverifiedUsers[index]);
  };

  const rejectBtnHandler = (index: number) => {
    console.log(unverifiedUsers[index]);
  };

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
              {/* TODO: Implement IonTab && IonGrid */}
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
                            Verified:{" "}
                            {unvUser.verified === true ? (
                              <IonIcon color="success" icon={checkmarkCircle} />
                            ) : (
                              <IonIcon color="danger" icon={closeCircle} />
                            )}
                          </IonText>
                          <IonButton
                            type="submit"
                            color="danger"
                            onClick={(event: any) => {
                              event.preventDefault();
                              rejectBtnHandler(index);
                            }}
                          >
                            Reject
                          </IonButton>
                          <IonButton
                            type="submit"
                            color="success"
                            onClick={(event: any) => {
                              event.preventDefault();
                              approveBtnHandler(index);
                            }}
                          >
                            Approve
                          </IonButton>
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
