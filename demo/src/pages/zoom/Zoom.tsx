import {useZoom} from "openfin-react-hooks";
import {_Window} from "openfin/_v2/api/window/window";
import * as Prism from "prismjs";
import React, {useEffect, useState} from "react";
import uuidv4 from "uuid/v4";

import styles from "./Zoom.module.css";

const codeExample = `import {useZoom} from "openfin-react-hooks";

const Component = () => {
    const [zoom, setZoom] = useZoom();

    return (
        <div>
            <div>Zoom level: {zoom}</div>
            <div>
                <strong>Adjust zoom level:</strong>
                <input
                    type="range" min="-3" max="3" value={zoom} step="0.1"
                    onChange={(e) => setZoom(Number(e.target.value))}
                />
            </div>
        </div>
    );
}
`;

const Zoom: React.FC = () => {
    const [win, setWin] = useState();
    const [zoom, setZoom] = useZoom(win);

    useEffect(Prism.highlightAll, []);

    useEffect(() => {
        let newWindow: _Window;
        const createWindow = async () => {
            newWindow = await window.fin.Window.create({
                autoShow: true,
                defaultHeight: 200,
                defaultWidth: 500,
                name: uuidv4(),
                url: process.env.REACT_APP_ZOOM_HTML,
            });
            setWin(newWindow);
        };

        createWindow();

        return () => {
            if (newWindow) {
                newWindow.close();
            }
        };
    }, []);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>useZoom</h1>
            <div className={styles.description}>
                This hook returns the current (and future) zoom of the provided window.
            </div>
            <div className={styles.description}>
                Try move the slider to see how the zoom level updates within the pop-out window.
            </div>
            <h2>Code Example</h2>
            <pre>
                <code className="language-jsx">
                    {codeExample}
                </code>
            </pre>
            <h2>Try it out</h2>
            <div>
                <strong>Zoom level:</strong>
                <span className={styles.value}>{zoom}</span>
            </div>
            <div>
                <strong>Adjust zoom level:</strong>
                <input className={styles.value} type="range" min="-3" max="3" value={zoom} step="0.1"
                    onChange={(e) => setZoom(Number(e.target.value))}
                />
            </div>
        </div>
    );
};

export default Zoom;
