// Ion Imports
import { IonApp, IonRouterOutlet, IonSplitPane } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";

// Component Imports
import Menu from "./components/Menu";
import { Home } from "./components/scheduler/Home";
import { RegistrationCard } from "./components/user/RegistrationCard";
import { LoginCard } from "./components/user/LoginCard";
import { Logout } from "./components/user/Logout";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <Menu />
          <IonRouterOutlet id="main">
            <Route path="/" exact={true}>
              <Redirect to="/user/login" />
            </Route>
            <Route path="/home" exact={true}>
              <Home />
            </Route>
            <Route path="/user/login" exact={true}>
              <LoginCard />
            </Route>
            <Route path="/user/logout" exact={true}>
              <Logout />
            </Route>
            <Route path="/user/register" exact={true}>
              <RegistrationCard />
            </Route>
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
