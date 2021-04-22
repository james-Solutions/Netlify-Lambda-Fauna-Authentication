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
  IonButton,
  IonProgressBar,
  IonText,
  IonRow,
  IonGrid,
  IonCol,
} from "@ionic/react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUnapprovedUsers,
  getUnapprovedUsers,
  getFetchingUnapprovedUsers,
  setUserApproval,
  getUpdateUnapprovedUsers,
} from "../../redux/slices/userSlice";

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
  const updateUsers = useSelector(getUpdateUnapprovedUsers);

  if (updateUsers === true) {
    dispatch(fetchUnapprovedUsers());
  }

  const unapprovedUsers = useSelector(getUnapprovedUsers);

  const approveBtnHandler = (index: number) => {
    dispatch(
      setUserApproval(unapprovedUsers[index], { index: index, approved: true })
    );
  };

  const rejectBtnHandler = (index: number) => {
    dispatch(
      setUserApproval(unapprovedUsers[index], { index: index, approved: false })
    );
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
              <IonGrid>
                <IonRow>
                  {unapprovedUsers.length > 0
                    ? unapprovedUsers.map((unvUser, index) => {
                        return (
                          <IonCol key={index} size={"4"}>
                            <IonCard>
                              <IonCardHeader>
                                <IonCardTitle>
                                  Email: {unvUser.email}
                                </IonCardTitle>
                              </IonCardHeader>
                              <IonCardContent>
                                <IonText style={TextContainerStyle}>
                                  <b>Username:</b> {unvUser.username}
                                </IonText>
                                <br />
                                <IonText style={TextContainerStyle}>
                                  <b>Requested Access Level:</b>{" "}
                                  {unvUser.accessLevel}
                                </IonText>
                                <br />
                                {unvUser.verified === true ? (
                                  <IonText
                                    style={TextContainerStyle}
                                    color="success"
                                  >
                                    <b>Email Verified</b>
                                  </IonText>
                                ) : (
                                  <IonText
                                    style={TextContainerStyle}
                                    color="danger"
                                  >
                                    <b>Email Unverified</b>
                                  </IonText>
                                )}
                                <hr style={{ border: "1px solid grey" }} />
                                <IonRow className="ion-align-items-center">
                                  {unvUser.errorMessage ? (
                                    <IonCol className="ion-align-self-center">
                                      <IonText color="danger">
                                        {unvUser.errorMessage}
                                      </IonText>
                                    </IonCol>
                                  ) : (
                                    ""
                                  )}
                                  {unvUser.updating ? (
                                    <IonCol className="ion-align-self-center">
                                      <IonText color="success">
                                        Updating User Approval
                                      </IonText>
                                      <IonProgressBar type="indeterminate"></IonProgressBar>
                                    </IonCol>
                                  ) : (
                                    ""
                                  )}
                                </IonRow>
                                <IonRow className="ion-align-items-center">
                                  <IonCol className="ion-align-self-center">
                                    <IonButton
                                      type="submit"
                                      color="danger"
                                      disabled={unvUser.updating}
                                      onClick={(event: any) => {
                                        event.preventDefault();
                                        rejectBtnHandler(index);
                                      }}
                                    >
                                      Reject
                                    </IonButton>
                                  </IonCol>
                                  <IonCol className="ion-align-self-center">
                                    <IonButton
                                      type="submit"
                                      color="success"
                                      disabled={unvUser.updating}
                                      onClick={(event: any) => {
                                        event.preventDefault();
                                        approveBtnHandler(index);
                                      }}
                                    >
                                      Approve
                                    </IonButton>
                                  </IonCol>
                                </IonRow>
                              </IonCardContent>
                            </IonCard>
                          </IonCol>
                        );
                      })
                    : ""}
                </IonRow>
              </IonGrid>
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
