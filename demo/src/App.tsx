import classNames from "classnames";
import React from "react";
import {Link, Route, RouteComponentProps, withRouter} from "react-router-dom";

import styles from "./App.module.css";
import {ReactComponent as Logo} from "./images/logo-openfin.svg";

import Docked from "./pages/docked";
import DockWindow from "./pages/dockWindow";
import Home from "./pages/home";
import InterApplicationBusPublish from "./pages/interApplicationBusPublish";
import InterApplicationBusSend from "./pages/interApplicationBusSend";
import InterApplicationBusSubscribe from "./pages/interApplicationBusSubscribe";
import Maximized from "./pages/maximized";

const App: React.FC<RouteComponentProps> = ({ history }) => {
    return (
        <div className={styles.containerApp}>
            <div className={styles.containerHeader} >
                <div
                    className={classNames(styles.buttonBack, { [styles.buttonBackDisabled]: history.length === 1})}
                    onClick={() => history.length > 1 && history.goBack()}
                >
                    <span className="material-icons">arrow_back</span>
                </div>
                <Link to="/">
                    <div className={styles.containerLogo}>
                        <Logo />
                        <div className={styles.subtitle}>React Hooks</div>
                    </div>
                </Link>
            </div>
            <div className={styles.containerContent}>
                <Route exact path="/" component={Home} />
                <Route exact path="/demo/maximized" component={Maximized} />
                <Route exact path="/demo/docked" component={Docked} />
                <Route exact path="/demo/inter-application-bus-subscribe" component={InterApplicationBusSubscribe} />
                <Route exact path="/demo/inter-application-bus-send" component={InterApplicationBusSend} />
                <Route exact path="/demo/inter-application-bus-publish" component={InterApplicationBusPublish} />
                <Route exact path="/demo/dock-window" component={DockWindow} />
            </div>
        </div>
    );
};

export default withRouter<RouteComponentProps>(App);
