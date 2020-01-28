import { useCallbackWhenAnyChildWindowClosed } from "openfin-react-hooks";
import { _Window } from "openfin/_v2/api/window/window";
import * as Prism from "prismjs";
import React, { useEffect, useState } from "react";

import styles from "./CallbackWhenAnyChildClosed.module.css";

const codeExample = `import { useCallbackWhenAnyChildWindowClosed } from "openfin-react-hooks";

const Component = () => {

    const mainWindow = window.fin.Window.getCurrentSync();

    useCallbackWhenAnyChildWindowClosed(
        (parent, child) =>
            alert(\`A child window (\${child.identity.name}) of window \${parent.identity.name} has been closed\`),
        mainWindow,
    );

    return null;
}
`;

const CallbackWhenAnyChildClosed: React.FC = () => {
    const [windows, setWindows] = useState<_Window[]>([]);

    const mainWindow = window.fin.Window.getCurrentSync();

    useEffect(Prism.highlightAll, []);

    useEffect(() => {
        const newWindows: _Window[] = [];

        const createWindow = async (num: number) => {
            newWindows.push(await window.fin.Window.create({
                autoShow: true,
                defaultHeight: 200,
                defaultWidth: 500,
                name: "child" + num,
                url: process.env.REACT_APP_CHILD_WINDOW_HTML,
            }));
        };

        Promise.all([
            createWindow(1),
            createWindow(2),
        ]).then(() => {
            setWindows(newWindows);
        });

    }, []);

    useEffect(() => {
        return () => {
            windows.forEach((w) => {
                w.close().catch((_: any) => { return; });
            });
        };
    }, [windows]);

    useCallbackWhenAnyChildWindowClosed(
        (parent, child) =>
            alert(`A child window (${child.identity.name}) of window ${parent.identity.name} has been closed`),
        mainWindow,
    );

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>useCallbackWhenAnyChildWindowClosed</h1>
            <div className={styles.description}>
                This hook will invoke a callback function when <em>any</em> child window of a given parent
                window has been closed. If no parent is given then it will default to the current window.
            </div>
            <br />
            <div className={styles.description}>
                If no children exist when the hook is called then nothing will happen on initialization.
                When children created after the hook was initally called are closed then the callback
                function will still be invoked.
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

export default CallbackWhenAnyChildClosed;
