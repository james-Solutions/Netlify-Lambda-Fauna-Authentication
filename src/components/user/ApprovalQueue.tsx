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
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonItem,
  IonList,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { Redirect, Route } from "react-router-dom";
import * as constants from "../../constants";
import { PendingUsers } from "./ApprovalQueue/PendingUsers";
import { RejectedUsers } from "./ApprovalQueue/RejectedUsers";
import { ApprovedUsers } from "./ApprovalQueue/ApprovedUsers";
import { calendar } from "ionicons/icons";
import { getUserAccessLevel } from "../../redux/slices/userSlice";
import { useSelector } from "react-redux";

interface TabsProps {}

export const ApprovalQueue: React.FC<TabsProps> = () => {
  const userAccessLevel = useSelector(getUserAccessLevel);
  const [queueSelected, setQueueSelected] = useState<string>("pending");
  useEffect(() => {
    setQueueSelected("pending");
  }, []);

  if (userAccessLevel !== constants.USER.ACCESS_LEVELS.ROOT) {
    return <Redirect to="/" />;
  } else if (userAccessLevel === constants.USER.ACCESS_LEVELS.ROOT) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>User Approval Queue</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonCard>
            <IonCardContent>
              <IonList>
                <IonItem>
                  <IonLabel>Queue</IonLabel>
                  <IonSelect
                    interface="popover"
                    onIonChange={(event) =>
                      setQueueSelected(event.detail.value)
                    }
                  >
                    <IonSelectOption defaultChecked={true} value="pending">
                      Pending Users
                    </IonSelectOption>
                    <IonSelectOption value="rejected">
                      Rejected Users
                    </IonSelectOption>
                    <IonSelectOption value="all">
                      All Approved Users
                    </IonSelectOption>
                  </IonSelect>
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>
          {queueSelected === "pending" ? <PendingUsers /> : ""}
          {queueSelected === "rejected" ? <RejectedUsers /> : ""}
          {queueSelected === "all" ? <ApprovedUsers /> : ""}
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
              <IonText color="danger">ACCESS RESTRICTED.</IonText>
            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonPage>
    );
  }
};
{
  /* <IonTabs>
  <IonRouterOutlet>
    <Redirect exact path="/approve" to="/approve/pending" />
        Using the render method prop cuts down the number of renders your
        components will have due to route changes. Use the component prop
        when your component depends on the RouterComponentProps passed in
        automatically. 
    <Route
      path="/approve/pending"
      // render={() => <PendingUsers />}
      component={PendingUsers}
      exact={true}
    />
    <Route
      path="/approve/rejected"
      // render={() => <RejectedUsers />}
      component={RejectedUsers}
      exact={true}
    />
    <Route path="/approve/all" render={() => <AllUsers />} exact={true} />
  </IonRouterOutlet>
  <IonTabBar slot="top">
    <IonTabButton tab="pending" href="/approve/pending">
      <IonIcon icon={calendar} />
      <IonLabel>Pending Users</IonLabel>
    </IonTabButton>
    <IonTabButton tab="rejected" href="/approve/rejected">
      <IonIcon icon={calendar} />
      <IonLabel>Rejected Users</IonLabel>
    </IonTabButton>
    <IonTabButton tab="all" href="/approve/all">
      <IonIcon icon={calendar} />
      <IonLabel>All Approved Users</IonLabel>
    </IonTabButton>
  </IonTabBar>
</IonTabs> */
}
