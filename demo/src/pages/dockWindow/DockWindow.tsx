import {ScreenEdge, useDockWindow} from "openfin-react-hooks";
import {_Window} from "openfin/_v2/api/window/window";
import * as Prism from "prismjs";
import React, {useEffect, useState} from "react";
import Switch from "react-switch";
import uuidv4 from "uuid/v4";

import styles from "./DockWindow.module.css";

const codeExample = `import {ScreenEdge, useDockWindow} from "openfin-react-hooks";

const Component = () => {
    const [allowUndocking, setAllowUndocking] = useState(true);
    const [edge, actions] = useDockWindow(ScreenEdge.NONE, window.fin.Window.getCurrentSync(), allowUndocking);

    return (
        <div>
            <button type="button" onClick={actions.dockTop}>Dock Top</button>
            <button type="button" onClick={actions.dockLeft}>Dock Left</button>
            <button type="button" onClick={actions.dockRight}>Dock Right</button>
            <button type="button" onClick={actions.dockNone}>Dock None</button>
            <button type="button" onClick={() => setAllowUndocking(!allowUndocking)}>Toggle user undocking</button>
        </div>
    )
}
`;

let win: _Window;

const DockWindow: React.FC = () => {
    const [allowUndocking, setAllowUndocking] = useState(true);
    const [edge, actions] = useDockWindow(ScreenEdge.NONE, win || window.fin.Window.getCurrentSync(), allowUndocking);

    useEffect(() => {
        const createWindow = async () => {
            win = await window.fin.Window.create({
                autoShow: true,
                defaultHeight: 200,
                defaultWidth: 500,
                name: uuidv4(),
                url: "about:blank",
            });
        };

        createWindow();

        return () => {
            if (win) {
                win.close();
            }
        };
    }, []);

    useEffect(Prism.highlightAll, []);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>useDockWindow</h1>
            <div className={styles.description}>This hook allows you to programatically dock a window to the edges
                (top, right, left) of the users primary monitor.</div>
            <div className={styles.description}>You can provide it an initial docked state, the window to dock
                and whether a user is able to undock a window themselves.</div>
            <div className={styles.description}>Try playing around with the example below, a child window has
                been spawned that can be docked to the edges of the screen.</div>
            <h2>Code Example</h2>
            <pre>
                <code className="language-jsx">
                    {codeExample}
                </code>
            </pre>
            <h2>Try it out</h2>
            <div className={styles.content}>
                <div>
                    <h3>Programmatic docking</h3>
                    <button type="button" onClick={actions.dockTop}>Dock Top</button>
                    <button type="button" onClick={actions.dockLeft}>Dock Left</button>
                    <button type="button" onClick={actions.dockRight}>Dock Right</button>
                    <button type="button" onClick={actions.dockBottom}>Dock Bottom</button>
                    <button type="button" onClick={actions.dockNone}>Dock None</button>
                </div>
                <div>
                    <h3>Current docked state</h3>
                    <div>{edge}</div>
                </div>
                <div>
                    <h3>Allow user undocking</h3>
                    <Switch onChange={(checked) => setAllowUndocking(checked)} checked={allowUndocking} />
                </div>
            </div>
        </div>
    );
};

export default DockWindow;
