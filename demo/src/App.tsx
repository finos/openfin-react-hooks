import * as Prism from "prismjs";
import React, {useEffect} from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import styles from "./App.module.css";
import {ReactComponent as Logo} from "./images/logo-openfin.svg";
import Home from "./pages/home";
import Maximized from "./pages/maximized";

const App: React.FC = () => {
    useEffect(Prism.highlightAll, []);

    return (
        <div className={styles.containerApp}>
            <div className={styles.containerHeader}>
                <Logo />
                <div className={styles.subtitle}>React Hooks</div>
            </div>
            <div className={styles.containerContent}>
                <Router>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/demo/maximized" component={Maximized} />
                </Router>
            </div>
        </div>
    );
};

export default App;
