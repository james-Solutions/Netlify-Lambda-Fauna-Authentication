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
} from "@ionic/react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUnverifiedUsers,
  getUnverifiedUsers,
} from "../../redux/slices/userSlice";

export const ApprovalQueue: React.FC = () => {
  const dispatch = useDispatch();
  const [finishedLoading, setFinishedLoading] = useState<boolean>(false);
  useEffect(() => {
    dispatch(fetchUnverifiedUsers());
    setFinishedLoading(true);
  }, []);

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
              <IonItem>
                <IonLabel>User...</IonLabel>
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
