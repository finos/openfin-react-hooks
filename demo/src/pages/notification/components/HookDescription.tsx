import React from "react";
import styles from "../Notification.module.css";

const DESCRIPTION =
    "This hook allows you to create and manage a single notification.";
const EXPLANATION =
    "Try clicking on the buttons below to see notification actions.";

export default () => (
    <>
        <h1 className={styles.title}>useNotification</h1>
        <div className={styles.description}>{DESCRIPTION}</div>
        <div className={styles.description}>{EXPLANATION}</div>
    </>
);
