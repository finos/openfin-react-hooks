import React from "react";
import styles from "../ChildWindow.module.css";

const DESCRIPTION =
  "This hook allows you to create and manage a single child window.";
const EXPLANATION =
  "Try clicking on the buttons below to see child window actions.";

export default () => (
  <>
    <h1 className={styles.title}>useChildWindow</h1>
    <div className={styles.description}>{DESCRIPTION}</div>
    <div className={styles.description}>{EXPLANATION}</div>
  </>
);
