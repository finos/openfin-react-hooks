import React from "react";
import styles from "./Home.module.css";

import DemoCard from "./demo-card";

const cards: IDemoCard[] = [
    {
        description: "Detects if the current window is maximized",
        icon: "maximize",
        id: "maximized",
        name: "useMaximized",
    },
    {
        description: "Detects if the current window is docked",
        icon: "lock",
        id: "docked",
        name: "useDocked",
    },
    {
        description: "Safely subscribe to a topic on the InterApplicationBus",
        icon: "arrow_back",
        id: "inter-application-bus-subscribe",
        name: "useInterApplicationBusSubscribe",
    },
];

const Home: React.FC = () => {
    return (
        <div className={styles.containerContent}>
            {cards.map((demo) => <DemoCard key={demo.id} demo={demo} />)}
        </div>
    );
};

export default Home;
