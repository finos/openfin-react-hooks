import {useMaximized} from "openfin-react-hooks";
import * as Prism from "prismjs";
import React, {useEffect} from "react";

import styles from "./Maximized.module.css";

const codeExample = `import {useMaximized} from "openfin-react-hooks";

const Component = () => {
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

    useEffect(Prism.highlightAll, []);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>useMaximize</h1>
            <div className={styles.description}>Try maximizing / unmaximizing the window to demonstrate this hook</div>
            <h2>Code Example</h2>
            <pre>
                <code className="language-jsx">
                    {codeExample}
                </code>
            </pre>
            <h2>Try it out</h2>
            <div>Window is <strong>{maximized ? "maximized" : "not maximized"}</strong></div>
            <br />
            <button type="button" onClick={() => setMaximized(!maximized)}>Toggle Maximize</button>
        </div>
    );
};

export default Maximized;
