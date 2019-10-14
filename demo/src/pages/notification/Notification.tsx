import * as Prism from "prismjs";
import React, { useEffect } from "react";
import Demo from "../../common/Demo";
import CodeExample from "./components/CodeExample";
import DemoActions from "./components/DemoActions";
import styles from "./Notification.module.css";

const Notification: React.FC = () => {
  useEffect(Prism.highlightAll, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>useBounds</h1>
      <div className={styles.description}>
        This hook returns the current (and future) bounds of the provided
        window.
      </div>
      <div className={styles.description}>
        Try moving / resizing this window to see how the bounds object
        automatically updates.
      </div>
      <CodeExample />
      <Demo>
        <DemoActions />
      </Demo>
    </div>
  );
};

export default Notification;
