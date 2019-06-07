import {useBounds} from "openfin-react-hooks";
import * as Prism from "prismjs";
import React, {useEffect} from "react";

import styles from "./Bounds.module.css";

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

const Bounds: React.FC = () => {
    const bounds = useBounds();

    useEffect(Prism.highlightAll, []);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>useBounds</h1>
            <div className={styles.description}>
                This hook returns the current (and future) bounds of the provided window.
            </div>
            <div className={styles.description}>
                Try moving / resizing this window to see how the bounds object automatically updates.
            </div>
            <h2>Code Example</h2>
            <pre>
                <code className="language-jsx">
                    {codeExample}
                </code>
            </pre>
            <h2>Try it out</h2>
            <div>Bounds: {JSON.stringify(bounds)}</div>
        </div>
    );
};

export default Bounds;
