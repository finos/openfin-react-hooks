import { useBounds } from "openfin-react-hooks";
import * as Prism from "prismjs";
import React, { useEffect, useState } from "react";

import styles from "./Bounds.module.css";

const defaults = {
    height: 825,
    left: 0,
    top: 0,
    width: 1200,
};

const codeExample = `import {useBounds} from "openfin-react-hooks";

const Component = () => {
    const [bounds, setBounds] = useBounds();
    const [left, setLeft] = useState(${defaults.left});
    const [top, setTop] = useState(${defaults.top});
    const [height, setHeight] = useState(${defaults.height});
    const [width, setWidth] = useState(${defaults.width});

    useEffect(() => {
        setLeft(bounds.left);
        setTop(bounds.top);
        setHeight(bounds.height);
        setWidth(bounds.width);
    }, [bounds])

    return (
        <div>
            <label>Left:</label><input value={left} onChange={(e) => setLeft(e.target.value)} />
            <label>Top:</label><input value={top} onChange={(e) => setTop(e.target.value)} />
            <label>Height:</label><input value={height} onChange={(e) => setHeight(e.target.value)} />
            <label>Width:</label><input value={width} onChange={(e) => setWidth(e.target.value)} />

            <button onClick={() => setBounds({ left, top, height, width })}>Set Bounds</button>
        </div>
    );
}
`;

const Bounds: React.FC = () => {
    const [bounds, setBounds] = useBounds();
    const [left, setLeft] = useState<number | null>(defaults.left);
    const [top, setTop] = useState<number | null>(defaults.top);
    const [height, setHeight] = useState<number | null>(defaults.height);
    const [width, setWidth] = useState<number | null>(defaults.width);

    useEffect(Prism.highlightAll, []);

    useEffect(() => {
        if (bounds != null) {
            setLeft(bounds.left);
            setTop(bounds.top);
            setHeight(bounds.height);
            setWidth(bounds.width);
        }
    }, [bounds]);

    const getDisplayValue = (val: number | null) => val != null ? val.toString() : "";

    const getNewValue = (val: string) => {
        const intValue = parseInt(val, 10);
        return isNaN(intValue) ? null : intValue;
    };

    const newBounds = {
        height: height || defaults.height,
        left: left || defaults.left,
        top: top || defaults.top,
        width: width || defaults.width,
    };

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
            <div className={styles.content}>
                <div>
                    <label>Left:</label>
                    <input
                        value={getDisplayValue(left)}
                        onChange={(e) => setLeft(getNewValue(e.target.value))}
                    />
                </div>
                <div>
                    <label>Top:</label>
                    <input
                        value={getDisplayValue(top)}
                        onChange={(e) => setTop(getNewValue(e.target.value))}
                    />
                </div>
                <div>
                    <label>Height:</label>
                    <input
                        value={getDisplayValue(height)}
                        onChange={(e) => setHeight(getNewValue(e.target.value))}
                    />
                </div>
                <div>
                    <label>Width:</label>
                    <input
                        value={getDisplayValue(width)}
                        onChange={(e) => setWidth(getNewValue(e.target.value))}
                    />
                </div>
            </div>
            <button onClick={() => setBounds(newBounds)}>Set Bounds</button>
        </div>
    );
};

export default Bounds;
