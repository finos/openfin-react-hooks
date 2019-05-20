import React from "react";

import styles from "./DemoCard.module.css";

interface IProps {
    demo: IDemoCard;
}

const DemoCard: React.FC<IProps> = ({demo}) => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.name}>{demo.name}</div>
                <div className="material-icons">{demo.icon}</div>
            </div>
            <div className={styles.description}>{demo.description}</div>
        </div>
    );
};

export default DemoCard;
