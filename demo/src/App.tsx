import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import styles from "./App.module.css";
import {ReactComponent as Logo} from "./images/logo-openfin.svg";
import Home from "./pages/home";

const App: React.FC = () => {
    return (
        <div className={styles.containerApp}>
            <div className={styles.containerHeader}>
                <Logo />
                <div className={styles.subtitle}>React Hooks</div>
            </div>
            <Router>
                <Route exact path="/" component={Home} />
            </Router>
        </div>
    );
};

export default App;
