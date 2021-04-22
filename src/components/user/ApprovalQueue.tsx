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
  fetchUnapprovedUsers,
  getUnapprovedUsers,
  getFetchingUnapprovedUsers,
} from "../../redux/slices/userSlice";
import { checkmarkCircle, closeCircle } from "ionicons/icons";

export const ApprovalQueue: React.FC = () => {
  const dispatch = useDispatch();
  const [finishedLoading, setFinishedLoading] = useState<boolean>(false);
  useEffect(() => {
    dispatch(fetchUnapprovedUsers());
    setFinishedLoading(true);
  }, []);
  const fetchingUnapprovedUsers = useSelector(getFetchingUnapprovedUsers);
  const TextContainerStyle = {
    display: "block",
  };

  const unapprovedUsers = useSelector(getUnapprovedUsers);

  const approveBtnHandler = (index: number) => {
    console.log(unapprovedUsers[index]);
  };

  const rejectBtnHandler = (index: number) => {
    console.log(unapprovedUsers[index]);
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
              {fetchingUnapprovedUsers === true ? (
                <div>
                  <IonText>Fetching Users</IonText>
                  <IonProgressBar type="indeterminate"></IonProgressBar>
                </div>
              ) : (
                ""
              )}
              {/* TODO: Implement IonTab && IonGrid */}
              {unapprovedUsers.length > 0
                ? unapprovedUsers.map((unvUser, index) => {
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
              <IonText>Fetching Users</IonText>
              <IonProgressBar type="indeterminate"></IonProgressBar>
            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonPage>
    );
  }
};
