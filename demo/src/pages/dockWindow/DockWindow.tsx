import {IDimensions, ScreenEdge, useDockWindow} from "openfin-react-hooks";
import {_Window} from "openfin/_v2/api/window/window";
import * as Prism from "prismjs";
import React, {useEffect, useState} from "react";
import Switch from "react-switch";
import uuidv4 from "uuid/v4";

import styles from "./DockWindow.module.css";

const codeExample = `import {ScreenEdge, useDockWindow} from "openfin-react-hooks";

const Component = () => {
    const [allowUndocking, setAllowUndocking] = useState(true);
    const [enableStretchToFit, setEnableStretchToFit] = useState(false);
    const [edge, actions] = useDockWindow(ScreenEdge.NONE, win || window.fin.Window.getCurrentSync(),
        allowUndocking, enableStretchToFit ? { dockedWidth: 50, dockedHeight: 50 } : undefined);

    return (
        <div>
            <button type="button" onClick={actions.dockTop}>Dock Top</button>
            <button type="button" onClick={actions.dockLeft}>Dock Left</button>
            <button type="button" onClick={actions.dockRight}>Dock Right</button>
            <button type="button" onClick={actions.dockNone}>Dock None</button>
            <button type="button" onClick={() => setAllowUndocking(!allowUndocking)}>
                Toggle user undocking
            </button>
            <button type="button" onClick={() => setEnableStretchToFit(!allowStretchToFit)}>
                Toggle Stretch to fit
            </button>
        </div>
    )
}
`;

const dimensions: IDimensions = { dockedWidth: 50, dockedHeight: 50 };

const DockWindow: React.FC = () => {
    const [win, setWin] = useState();
    const [enableStretchToFit, setEnableStretchToFit] = useState(false);
    const [allowUndocking, setAllowUndocking] = useState(true);
    const [edge, actions] = useDockWindow(ScreenEdge.NONE, win || window.fin.Window.getCurrentSync(),
        allowUndocking, enableStretchToFit ? dimensions : undefined);

    useEffect(() => {
        let newWindow: _Window;

        const createWindow = async () => {
            newWindow = await window.fin.Window.create({
                autoShow: true,
                defaultHeight: 200,
                defaultWidth: 500,
                frame: !enableStretchToFit,
                name: uuidv4(),
                url: "/dock-window.html",
            });
            setWin(newWindow);
        };

        createWindow();

        return () => {
            if (newWindow) {
                newWindow.close();
            }
        };
    }, [allowUndocking, enableStretchToFit]);

    useEffect(Prism.highlightAll, []);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>useDockWindow</h1>
            <div className={styles.description}>This hook allows you to programatically dock a window to the edges
                (top, right, left) of the users primary monitor.</div>
            <div className={styles.description}>You can provide it an initial docked state, the window to dock,
                whether a user is able to undock a window themselves and if the window stretches to fit its docked
                border.</div>
            <div className={styles.description}>Try playing around with the example below, a child window has
                been spawned that can be docked to the edges of the screen.</div>
            <br />
            <div className={styles.description}>
                <em>
                    Note: Due to positioning issues with docking framed windows, it's reccomended you only use this
                    hook with frameless windows if you're using stretch to fit behaviour.
                </em>
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
                    <h3>Programmatic docking</h3>
                    <button type="button" onClick={actions.dockTop} className={styles.buttonDock}>Top</button>
                    <button type="button" onClick={actions.dockLeft} className={styles.buttonDock}>Left</button>
                    <button type="button" onClick={actions.dockRight} className={styles.buttonDock}>Right</button>
                    <button type="button" onClick={actions.dockBottom} className={styles.buttonDock}>Bottom</button>
                    <button type="button" onClick={actions.dockNone} className={styles.buttonDock}>None</button>
                </div>
                <div>
                    <h3>Current docked state</h3>
                    <div>{edge}</div>
                </div>
                <div>
                    <h3>Allow user undocking</h3>
                    <Switch onChange={(checked) => setAllowUndocking(checked)} checked={allowUndocking} />
                </div>
                <div>
                    <h3>Stretch to Fit</h3>
                    <Switch onChange={(checked) => setEnableStretchToFit(checked)} checked={enableStretchToFit} />
                </div>
            </div>
        </div>
    );
};

export default DockWindow;
