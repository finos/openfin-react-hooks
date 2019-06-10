import React from "react";
import styles from "./Home.module.css";

import DemoCard from "./demo-card";

const cards: IDemoCard[] = [
    {
        description: "Detects if the current window is maximized",
        icon: "maximize",
        iconRotate: false,
        id: "maximized",
        name: "useMaximized",
    },
    {
        description: "Detects if the current window is docked",
        icon: "lock",
        iconRotate: false,
        id: "docked",
        name: "useDocked",
    },
    {
        description: "Safely subscribe to a topic on the InterApplicationBus",
        icon: "arrow_back",
        iconRotate: false,
        id: "inter-application-bus-subscribe",
        name: "useInterApplicationBusSubscribe",
    },
    {
        description: "Auto-magically send properties on the InterApplicationBus whenever they change",
        icon: "arrow_upward",
        iconRotate: false,
        id: "inter-application-bus-send",
        name: "useInterApplicationBusSend",
    },
    {
        description: "Auto-magically publish properties on the InterApplicationBus whenever they change",
        icon: "publish",
        iconRotate: false,
        id: "inter-application-bus-publish",
        name: "useInterApplicationBusPublish",
    },
    {
        description: "Dock a window to edges of the screen",
        icon: "zoom_out_map",
        iconRotate: true,
        id: "dock-window",
        name: "useDockWindow",
    },
    {
        description: "Subscribe to the bounds of a window changing",
        icon: "settings_overscan",
        iconRotate: false,
        id: "bounds",
        name: "useBounds",
    },
    {
        description: "Listen to and update window options",
        icon: "menu",
        iconRotate: false,
        id: "options",
        name: "useOptions",
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
