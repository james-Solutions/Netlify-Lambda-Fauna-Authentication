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

export const ApprovedUsers: React.FC = () => {
  const dispatch = useDispatch();
  const [finishedLoading, setFinishedLoading] = useState<boolean>(false);
  useEffect(() => {
    dispatch(fetchUsers(constants.USER.STATUS.APPROVED));
    setFinishedLoading(true);
  }, []);
  const TextContainerStyle = {
    display: "block",
  };

  const fetchingApprovedUsers = useSelector(getFetchingUsers);
  const queueErrorMessage = useSelector(getFetchUsersErrorMessage);
  const updateUsers = useSelector(getUpdateUsers);
  const approvedUsers = useSelector(getUnapprovedUsers);
  const userAccessLevel = useSelector(getUserAccessLevel);

  if (updateUsers === true) {
    dispatch(fetchUsers(constants.USER.STATUS.APPROVED));
  }

  const rejectBtnHandler = (index: number) => {
    dispatch(
      setUserApproval(approvedUsers[index], {
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
          <IonCardTitle>All Users</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonGrid>
            <IonRow>
              {fetchingApprovedUsers ? (
                <IonProgressBar type="indeterminate"></IonProgressBar>
              ) : (
                ""
              )}
              {queueErrorMessage ? (
                <IonText color="danger">
                  <b>Error: </b>
                  {queueErrorMessage}
                </IonText>
              ) : (
                ""
              )}
              {approvedUsers.length > 0
                ? approvedUsers.map((unvUser, index) => {
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
                            <IonText style={TextContainerStyle} color="success">
                              <b>Account Approved</b>
                            </IonText>
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
                                  color="warning"
                                  disabled={unvUser.updating}
                                  onClick={(event: any) => {
                                    event.preventDefault();
                                    rejectBtnHandler(index);
                                  }}
                                >
                                  Reject
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
          <IonCardTitle>Users Rejected</IonCardTitle>
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
