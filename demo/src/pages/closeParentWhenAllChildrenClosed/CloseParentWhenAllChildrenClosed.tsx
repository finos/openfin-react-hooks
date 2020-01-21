import { useCloseParentWindowWhenAllChildrenClosed } from "openfin-react-hooks";
import { _Window } from "openfin/_v2/api/window/window";
import * as Prism from "prismjs";
import React, { useEffect } from "react";

import styles from "./CloseParentWhenAllChildrenClosed.module.css";

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

const CloseParentWhenAllChildrenClosed: React.FC = () => {

    useEffect(Prism.highlightAll, []);

    useEffect(() => {
        let newWindow: _Window;

        const createWindow = async () => {
            newWindow = await window.fin.Window.create({
                autoShow: true,
                defaultHeight: 200,
                defaultWidth: 500,
                name: "parent",
                url: process.env.REACT_APP_PARENT_WINDOW_HTML,
            });
        };

        createWindow().then(() => {
            newWindow.createWindow({
                autoShow: true,
                defaultHeight: 200,
                defaultWidth: 500,
                name: "child1",
                url: process.env.REACT_APP_CHILD_WINDOW_HTML,
            });

            newWindow.createWindow({
                autoShow: true,
                defaultHeight: 200,
                defaultWidth: 500,
                name: "child2",
                url: process.env.REACT_APP_CHILD_WINDOW_HTML,
            });
        });

        return () => {
            if (newWindow) {
                newWindow.close();
            }
        };
    }, []);

    useCloseParentWindowWhenAllChildrenClosed();

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>useCloseParentWindowWhenAllChildrenClosed</h1>
            <div className={styles.description}>
                This hook will close the given window when <em>all</em> of its children have been closed.
            </div>
            <div className={styles.description}>
                If no children exist when the hook is called then nothing will happen on initialization.
            </div>
            <div className={styles.description}>
                Any children created after the hook was initally called will also have to be closed to
                close the parent window.
            </div>
            <h2>Code Example</h2>
            <pre>
                <code className="language-jsx">
                    {codeExample}
                </code>
            </pre>
        </div>
    );
};

export default CloseParentWhenAllChildrenClosed;
