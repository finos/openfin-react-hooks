import {useChildWindow} from "openfin-react-hooks";
import { WindowOption } from "openfin/_v2/api/window/windowOption";
// import * as Prism from "prismjs";
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

const ChildWindow: React.FC = () => {
     const childWindow = useChildWindow("childWindow.html");
     const windowOptions: WindowOption = {};

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
            <button onClick={() => childWindow.launch(windowOptions)}>Launch Child Window</button>
            <button
                onClick={() => childWindow.populateDOM(<p>Hello World!</p>)}
                disabled={childWindow.state !== "LAUNCHED"}
            >
                Populate Child Window
            </button>
            <button onClick={() => childWindow.close()} disabled={!childWindow.window}>Close Child Window</button>
        </div>
    );
};

export default ChildWindow;
