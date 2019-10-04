import { useChildWindow } from "openfin-react-hooks";
import { WindowOption } from "openfin/_v2/api/window/windowOption";
import React from "react";

import styles from "./ChildWindow.module.css";

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

const WINDOW_NAME = "Child Window";

const ChildWindow: React.FC = () => {
    const windowOptions: WindowOption = {
        autoShow: true,
        defaultHeight: 200,
        defaultWidth: 500,
        maxWidth: 400,
        name: WINDOW_NAME,
        url: process.env.REACT_APP_CHILD_WINDOW_HTML,
        waitForPageLoad: true,
    };

    const childWindow = useChildWindow({
        cssUrl: process.env.REACT_APP_CHILD_WINDOW_CSS,
        name: WINDOW_NAME,
        parentDocument: document,
        shouldClosePreviousOnLaunch: true,
        windowOptions,
    });

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>useChildWindow</h1>
            <div className={styles.description}>
                This hook returns allows creating and managing child windows.
            </div>
            <div className={styles.description}>
                Try clikcing on a button to see a childWindow launched.
            </div>
            <h2>Code Example</h2>
            <pre>
                <code className="language-jsx">
                    {codeExample}
                </code>
            </pre>
            <h2>Try it out</h2>
            <h4>Child Window Actions</h4>
            <button onClick={() => childWindow.launch()}>Launch</button>
            <button
                onClick={() => childWindow.populateDOM(<p>Hello World!</p>)}
                disabled={childWindow.state !== "LAUNCHED"}
            >
                Populate
            </button>
            <button onClick={() => childWindow.close()} disabled={!childWindow.window}>Close</button>
        </div>
    );
};

export default ChildWindow;
