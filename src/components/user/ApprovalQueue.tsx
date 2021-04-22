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
import {
  fetchUnapprovedUsers,
  getUnapprovedUsers,
  getFetchingUnapprovedUsers,
  setUserApproval,
  getUpdateUnapprovedUsers,
  getUnapprovedUsersErrorMessage,
} from "../../redux/slices/userSlice";

export const ApprovalQueue: React.FC = () => {
  const dispatch = useDispatch();
  const [finishedLoading, setFinishedLoading] = useState<boolean>(false);
  useEffect(() => {
    dispatch(fetchUnapprovedUsers());
    setFinishedLoading(true);
  }, []);
  const TextContainerStyle = {
    display: "block",
  };

  const fetchingUnapprovedUsers = useSelector(getFetchingUnapprovedUsers);
  const queueErrorMessage = useSelector(getUnapprovedUsersErrorMessage);
  const updateUsers = useSelector(getUpdateUnapprovedUsers);
  const unapprovedUsers = useSelector(getUnapprovedUsers);

  if (updateUsers === true) {
    dispatch(fetchUnapprovedUsers());
  }

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
          {/* <IonTabs>
                <IonRouterOutlet>
                  <Redirect exact path="/tabs" to="/tabs/schedule" />
                  Using the render method prop cuts down the number of renders your components will have due to route changes.
                  Use the component prop when your component depends on the RouterComponentProps passed in automatically.
                  
                  <Route path="/tabs/schedule" render={() => <SchedulePage />} exact={true} />
                  <Route path="/tabs/speakers" render={() => <SpeakerList />} exact={true} />
                  <Route path="/tabs/speakers/:id" component={SpeakerDetail} exact={true} />
                  <Route path="/tabs/schedule/:id" component={SessionDetail} />
                  <Route path="/tabs/speakers/sessions/:id" component={SessionDetail} />
                  <Route path="/tabs/map" render={() => <MapView />} exact={true} />
                  <Route path="/tabs/about" render={() => <About />} exact={true} />
                </IonRouterOutlet>
                <IonTabBar slot="bottom">
                  <IonTabButton tab="schedule" href="/tabs/schedule">
                    <IonIcon icon={calendar} />
                    <IonLabel>Schedule</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="speakers" href="/tabs/speakers">
                    <IonIcon icon={people} />
                    <IonLabel>Speakers</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="map" href="/tabs/map">
                    <IonIcon icon={location} />
                    <IonLabel>Map</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab="about" href="/tabs/about">
                  <IonIcon icon={informationCircle} />
                  <IonLabel>About</IonLabel>
                    </IonTabButton>
                </IonTabBar>
              </IonTabs> */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Users pending approval</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
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
