import { useNotification } from "openfin-react-hooks";
import * as Prism from "prismjs";
import React, { useEffect } from "react";

import styles from "./Notification.module.css";

const codeExample = `import {useBounds} from "openfin-react-hooks";

const Component = () => {
    const bounds = useBounds();

    return (
        <div>
            <div>Bounds: {JSON.stringify(bounds)}</div>
        </div>
    );
}
`;

// htmlUrl: string;
// parentDocument?: HTMLDocument;
// cssUrl?: string;
// shouldInheritCss?: boolean;
// shouldInheritScripts?: boolean;
// jsx?: JSX.Element;

const Notification: React.FC = () => {
  const notification = useNotification({
    htmlUrl: "notification.html",
  });

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
      <h2>Code Example</h2>
      <pre>
        <code className="language-jsx">{codeExample}</code>
      </pre>
      <h2>Try it out</h2>
      <button onClick={notification.launch}></button>
    </div>
  );
};

export default Notification;
