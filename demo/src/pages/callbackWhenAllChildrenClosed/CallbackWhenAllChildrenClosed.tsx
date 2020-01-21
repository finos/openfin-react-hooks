import { useCallbackWindowWhenAllChildrenClosed } from "openfin-react-hooks";
import { _Window } from "openfin/_v2/api/window/window";
import * as Prism from "prismjs";
import React, { useEffect, useState } from "react";

import styles from "./CallbackWhenAllChildrenClosed.module.css";

const codeExample = `import { useCallbackWindowWhenAllChildrenClosed } from "openfin-react-hooks";

const Component = () => {

    useCallbackWindowWhenAllChildrenClosed(
        (parent: _Window) => alert('All children of window \${parent.identity.name} have been closed'),
    );

    return (
        <div></div>
    );
}
`;

const CallbackWhenAllChildrenClosed: React.FC = () => {
    const [windows, setWindows] = useState<_Window[]>([]);

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
            createWindow(3),
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

    useCallbackWindowWhenAllChildrenClosed(
        (parent) => alert(`All children of window ${parent.identity.name} have been closed`),
    );

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>useCallbackWindowWhenAllChildrenClosed</h1>
            <div className={styles.description}>
                This hook will invoke a callback function when <em>all</em> of its children have been closed.
            </div>
            <div className={styles.description}>
                If no children exist when the hook is called then nothing will happen on initialization.
            </div>
            <div className={styles.description}>
                Any children created after the hook was initally called will also have to be closed to
                invoke the callback function.
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

export default CallbackWhenAllChildrenClosed;
