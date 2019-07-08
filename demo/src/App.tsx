import classNames from "classnames";
import React from "react";
import { Link, Route, RouteComponentProps, withRouter } from "react-router-dom";

import styles from "./App.module.css";
import { ReactComponent as LogoOpenfin } from "./images/logo-openfin.svg";
import { ReactComponent as LogoScottLogic } from "./images/logo-scott-logic.svg";

import Bounds from "./pages/bounds";
import ChannelClient from "./pages/channels/channelClient";
import ChannelProvider from "./pages/channels/channelProvider";
import Docked from "./pages/docked";
import DockWindow from "./pages/dockWindow";
import Focus from "./pages/focus";
import Home from "./pages/home";
import InterApplicationBusPublish from "./pages/interApplicationBusPublish";
import InterApplicationBusSend from "./pages/interApplicationBusSend";
import InterApplicationBusSubscribe from "./pages/interApplicationBusSubscribe";
import Maximized from "./pages/maximized";
import Options from "./pages/options";
import UserMovement from "./pages/userMovement";
import Zoom from "./pages/zoom";

const App: React.FC<RouteComponentProps> = ({ history }) => {
  return (
    <div className={styles.containerApp}>
      <div className={styles.containerHeader}>
        <div
          className={classNames(styles.buttonBack, { [styles.buttonBackDisabled]: history.length === 1 })}
          onClick={() => history.length > 1 && history.goBack()}
        >
          <span className="material-icons">arrow_back</span>
        </div>
        <Link to="/">
          <div className={styles.containerLogoOpenfin}>
            <LogoOpenfin />
            <span className={styles.subtitleOpenfin}>React Hooks</span>
          </div>
        </Link>
        <div className={styles.containerLogoScottLogic}>
          <span className={styles.containerSubtitleScottLogic}>
            developed thanks to
          </span>
          <LogoScottLogic />
        </div>
      </div>
      <div className={styles.containerContent}>
        <Route exact path="/" component={Home} />
        <Route exact path="/demo/maximized" component={Maximized} />
        <Route exact path="/demo/docked" component={Docked} />
        <Route
          exact
          path="/demo/inter-application-bus-subscribe"
          component={InterApplicationBusSubscribe}
        />
        <Route
          exact
          path="/demo/inter-application-bus-send"
          component={InterApplicationBusSend}
        />
        <Route
          exact
          path="/demo/inter-application-bus-publish"
          component={InterApplicationBusPublish}
        />
        <Route exact path="/demo/dock-window" component={DockWindow} />
        <Route exact path="/demo/bounds" component={Bounds} />
        <Route exact path="/demo/options" component={Options} />
        <Route exact path="/demo/zoom" component={Zoom} />
        <Route exact path="/demo/focus" component={Focus} />
        <Route exact path="/demo/user-movement" component={UserMovement} />
        <Route
          exact
          path="/demo/channel-provider"
          component={ChannelProvider}
        />
        <Route exact path="/demo/channel-client" component={ChannelClient} />
      </div>
    </div>
  );
};

export default withRouter<RouteComponentProps>(App);
