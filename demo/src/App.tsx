import React from "react";
import styles from "./App.module.css";

import DemoCard from "./demo-card";
import {ReactComponent as Logo} from "./images/logo-openfin.svg";

const cards: IDemoCard[] = [
    {
        description: "Allows you to detect if current window is maximized",
        icon: "maximize",
        id: "maximized",
        name: "useMaximized",
    },
    {
        description: "Allows you to detect if current window is docked",
        icon: "lock",
        id: "docked",
        name: "useDocked",
    },
];

const App: React.FC = () => {
    return (
        <div className={styles.containerApp}>
            <div className={styles.containerHeader}>
                <Logo/>
                <div className={styles.subtitle}>React Hooks</div>
            </div>
            <div className={styles.containerContent}>
                {
                    cards.map((demo) => <DemoCard key={demo.id} demo={demo} />)
                }
            </div>
        </div>
    );
};

export default App;
