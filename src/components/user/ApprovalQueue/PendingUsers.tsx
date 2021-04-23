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
  IonTabs,
  IonTab,
} from "@ionic/react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import {
  fetchUsers,
  getUnapprovedUsers,
  getFetchingUsers,
  setUserApproval,
  getUpdateUsers,
  getFetchUsersErrorMessage,
  getUserAccessLevel,
} from "../../../redux/slices/userSlice";
import * as constants from "../../../constants";

export const PendingUsers: React.FC = () => {
  const dispatch = useDispatch();
  const [finishedLoading, setFinishedLoading] = useState<boolean>(false);
  useEffect(() => {
    dispatch(fetchUsers(constants.USER.STATUS.PENDING));
    setFinishedLoading(true);
  }, []);
  const TextContainerStyle = {
    display: "block",
  };

  const fetchingUnapprovedUsers = useSelector(getFetchingUsers);
  const queueErrorMessage = useSelector(getFetchUsersErrorMessage);
  const updateUsers = useSelector(getUpdateUsers);
  const unapprovedUsers = useSelector(getUnapprovedUsers);
  const userAccessLevel = useSelector(getUserAccessLevel);

  if (updateUsers === true) {
    dispatch(fetchUsers(constants.USER.STATUS.PENDING));
  }

  const approveBtnHandler = (index: number) => {
    dispatch(
      setUserApproval(unapprovedUsers[index], {
        index: index,
        approved: true,
        rejected: false,
      })
    );
  };

  const rejectBtnHandler = (index: number) => {
    dispatch(
      setUserApproval(unapprovedUsers[index], {
        index: index,
        approved: false,
        rejected: true,
      })
    );
  };

  if (userAccessLevel !== constants.USER.ACCESS_LEVELS.ROOT) {
    return <Redirect to="/" />;
  } else if (
    finishedLoading &&
    userAccessLevel === constants.USER.ACCESS_LEVELS.ROOT
  ) {
    return (
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Users pending approval</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonGrid>
            <IonRow>
              {queueErrorMessage ? (
                <IonText color="danger">
                  <b>Error:</b> {queueErrorMessage}
                </IonText>
              ) : (
                ""
              )}
              {fetchingUnapprovedUsers === true ? (
                <div>
                  <IonText>Fetching Users</IonText>
                  <IonProgressBar type="indeterminate"></IonProgressBar>
                </div>
              ) : (
                ""
              )}
              {unapprovedUsers.length > 0
                ? unapprovedUsers.map((unvUser, index) => {
                    return (
                      <IonCol key={index} size={"4"}>
                        <IonCard>
                          <IonCardHeader>
                            <IonCardTitle>Email: {unvUser.email}</IonCardTitle>
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
                                  <IonText color="secondary">
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
    );
  } else if (userAccessLevel === constants.USER.ACCESS_LEVELS.ROOT) {
    return (
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Users pending approval</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonText>Fetching Users</IonText>
          <IonProgressBar type="indeterminate"></IonProgressBar>
        </IonCardContent>
      </IonCard>
    );
  } else {
    return (
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Users pending approval</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonText color="danger">ACCESS RESTRICTED.</IonText>
        </IonCardContent>
      </IonCard>
    );
  }
};
