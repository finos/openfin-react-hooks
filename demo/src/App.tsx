import classNames from "classnames";
import React from "react";
import {
    Link, Redirect, Route, RouteComponentProps, Switch, withRouter,
} from "react-router-dom";

import styles from "./App.module.css";
import { ReactComponent as LogoOpenfin } from "./images/logo-openfin.svg";
import { ReactComponent as LogoScottLogic } from "./images/sl-logo-charcoal.svg";

import Bounds from "./pages/bounds";
import ChannelProvider from "./pages/channels";
import ChannelClient from "./pages/channels/channelClient";
import ChildWindow from "./pages/childWindow";
import CloseParentWhenAllChildrenClosed from "./pages/closeParentWhenAllChildrenClosed";
import Docked from "./pages/docked";
import DockWindow from "./pages/dockWindow";
import Focus from "./pages/focus";
import Home from "./pages/home";
import InterApplicationBusPublish from "./pages/interApplicationBusPublish";
import InterApplicationBusSend from "./pages/interApplicationBusSend";
import InterApplicationBusSubscribe from "./pages/interApplicationBusSubscribe";
import Maximized from "./pages/maximized";
import Notification from "./pages/notification";
import Options from "./pages/options";
import UserMovement from "./pages/userMovement";
import Zoom from "./pages/zoom";

const App: React.FC<RouteComponentProps> = ({ history }) => {
    return (
        <div className={styles.containerApp}>
            <div className={styles.containerHeader}>
                <div
                    className={classNames(styles.buttonBack, {
                        [styles.buttonBackDisabled]: history.location.pathname === "/",
                    })}
                    onClick={() => history.location.pathname !== "/" && history.goBack()}
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
                    <LogoScottLogic />
                </div>
            </div>
            <div className={styles.containerContent}>
                <Switch>
                    <Route exact path="/" component={Home} />

                    <Route exact path="/demo/maximized"
                        component={Maximized}
                    />
                    <Route exact path="/demo/docked"
                        component={Docked}
                    />
                    <Route exact path="/demo/inter-application-bus-subscribe"
                        component={InterApplicationBusSubscribe}
                    />
                    <Route exact path="/demo/inter-application-bus-send"
                        component={InterApplicationBusSend}
                    />
                    <Route exact path="/demo/inter-application-bus-publish"
                        component={InterApplicationBusPublish}
                    />
                    <Route exact path="/demo/dock-window"
                        component={DockWindow}
                    />
                    <Route exact path="/demo/bounds"
                        component={Bounds}
                    />
                    <Route exact path="/demo/options"
                        component={Options}
                    />
                    <Route exact path="/demo/zoom"
                        component={Zoom}
                    />
                    <Route exact path="/demo/focus"
                        component={Focus}
                    />
                    <Route exact path="/demo/user-movement"
                        component={UserMovement}
                    />
                    <Route exact path="/demo/channel-provider"
                        component={ChannelProvider}
                    />
                    <Route exact path="/demo/channel-client"
                        component={ChannelClient}
                    />
                    <Route exact path="/demo/child-window"
                        component={ChildWindow}
                    />
                    <Route exact path="/demo/notification"
                        component={Notification}
                    />
                    <Route exact path="/demo/closeParentWhenAllChildrenClosed"
                        component={CloseParentWhenAllChildrenClosed}
                    />
                    <Redirect to={"/"} />
                </Switch>
            </div>
        </div>
    );
};

export default withRouter<RouteComponentProps>(App);
