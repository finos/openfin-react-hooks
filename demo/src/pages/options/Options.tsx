import {useOptions} from "openfin-react-hooks";
import * as Prism from "prismjs";
import React, {useEffect} from "react";

import styles from "./Options.module.css";

const codeExample = `import {useOptions} from "openfin-react-hooks";

const Component = () => {
    const [options, setOptions] = useOptions();

    return (
        <div>
            <div>
                <strong>Options customData:</strong>
                <span>{options && options.customData ? JSON.stringify(options.customData) : "empty"}</span>
            </div>
            <div>
                <strong>Update options custom data:</strong>
                <input type="text" onChange={(e) => setOptions({ customData: e.target.value })} />
            </div>
        </div>
    );
}
`;

const Bounds: React.FC = () => {
    const [options, setOptions] = useOptions();

    useEffect(Prism.highlightAll, []);

    return (
    <div className={styles.container}>
        <h1 className={styles.title}>useOptions</h1>
        <div className={styles.description}>
            This hook returns the current (and future) options of the provided window.
        </div>
        <div className={styles.description}>
            Try updating the window options to see how the value automatically updates.
        </div>
        <h2>Code Example</h2>
        <pre>
            <code className="language-jsx">
                {codeExample}
            </code>
        </pre>
        <h2>Try it out</h2>
        <div>
            <strong>Options customData:</strong>
            <span className={styles.value}>
                {options && options.customData ? JSON.stringify(options.customData) : "empty"}
            </span>
        </div>
        <br />
        <div>
            <strong>Update options custom data:</strong>
            <input type="text" onChange={(e) => setOptions({ customData: e.target.value })} className={styles.value} />
        </div>
    </div>
    );
};

export default Bounds;
