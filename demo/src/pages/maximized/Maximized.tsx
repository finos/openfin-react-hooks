import {useMaximized} from "openfin-react-hooks";
import React from "react";

import styles from "./Maximized.module.css";

const codeExample = `import {useMaximized} from "openfin-react-hooks";

const Maximized = () => {
    const [maximized, setMaximized] = useMaximized();

    return (
        <div>
            <div>Window is <strong>{maximized ? "maximized" : "not maximized"}</strong></div>
            <button type="button" onClick={() => setMaximized(!maximized)}>Toggle Maximize</button>
        </div>
    )
}
`;

const Maximized: React.FC = () => {
    const [maximized, setMaximized] = useMaximized();

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>useMaximize</h1>
            <div className={styles.description}>Please maximize / unmaximize the window to demonstrate this hook</div>
            <pre>
                <code className="language-jsx">
                    {codeExample}
                </code>
            </pre>
            <h2>Example</h2>
            <div>Window is <strong>{maximized ? "maximized" : "not maximized"}</strong></div>
            <br />
            <button type="button" onClick={() => setMaximized(!maximized)}>Toggle Maximize</button>

        </div>
    );
};

export default Maximized;
