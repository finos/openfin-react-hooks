import {useFocus} from "openfin-react-hooks";
import {_Window} from "openfin/_v2/api/window/window";
import * as Prism from "prismjs";
import React, {useEffect, useState} from "react";
import uuidv4 from "uuid/v4";

import styles from "./Focus.module.css";

const codeExample = `import {useZoom} from "openfin-react-hooks";

const Component = () => {
    const [isFocused, setFocus, bringToFront, setAsForeground] = useFocus();

    return (
        <div>
            <span>Window is <strong>{isFocused ? "focused" : "not focused"}</strong></span>
            <button type="button" onClick={() => setFocus(true)} disabled={isFocused}>Focus</button>
            <button type="button" onClick={() => setFocus(false)} disabled={!isFocused}>Blur</button>
            <button type="button" onClick={bringToFront} disabled={isFocused}>Bring to front</button>
            <button type="button" onClick={setAsForeground} disabled={isFocused}>Set as foreground</button>
        </div>
    );
}
`;

const Focus: React.FC = () => {
    const [win, setWin] = useState();
    const [isFocused, setFocus, bringToFront, setAsForeground] = useFocus(win);

    useEffect(Prism.highlightAll, []);

    useEffect(() => {
        let newWindow: _Window;
        const createWindow = async () => {
            newWindow = await window.fin.Window.create({
                autoShow: true,
                defaultHeight: 200,
                defaultWidth: 500,
                name: uuidv4(),
                url: "about:blank",
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
            <h1 className={styles.title}>useFocus</h1>
            <div className={styles.description}>
                This hook returns the current (and future) focus of the provided window.
            </div>
            <div className={styles.description}>
                You can also programatically change the focus of the provided window,
                try out the window action buttons below to see it in action.
            </div>
            <div className={styles.description}>
                Note: <em>window.bringToFront</em> doesn't set the window as focused
                unlike <em>window.setAsForeground</em>.
            </div>
            <h2>Code Example</h2>
            <pre>
                <code className="language-jsx">
                    {codeExample}
                </code>
            </pre>
            <h2>Try it out</h2>
            <div>
                <span>Window is <strong>{isFocused ? "focused" : "not focused"}</strong></span>
                <h3>Window Actions</h3>
                <button type="button" onClick={() => setFocus(true)}>
                    Focus
                </button>
                <button type="button" className={styles.marginLeft} onClick={() => setFocus(false)}>
                    Blur
                </button>
                <button type="button" className={styles.marginLeft} onClick={bringToFront}>
                    Bring to front
                </button>
                <button type="button" className={styles.marginLeft} onClick={setAsForeground}>
                    Set as foreground
                </button>
            </div>
        </div>
    );
};

export default Focus;
