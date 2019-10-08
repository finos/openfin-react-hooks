import { IUseChildWindow, useChildWindow } from "openfin-react-hooks";
import { WindowOption } from "openfin/_v2/api/window/windowOption";
import React, { useState } from "react";
import ReactHtmlParser from "react-html-parser";
import styles from "./ChildWindow.module.css";

const codeExample = `import {useChildWindow} from "openfin-react-hooks";

const Component = () => {
    const WINDOW_OPTIONS: WindowOption = {
        name: WINDOW_NAME,
        url: PATH_TO_CHILD_WINDOW_HTML,
    };

    const CHILD_WINDOW_HOOK_OPTIONS: IUseChildWindow = {
        cssUrl: PATH_TO_CHILD_WINDOW_CSS,
        name: WINDOW_NAME,
        shouldClosePreviousOnLaunch: true,
        shouldInheritCSS: true,
        shouldInheritScripts: true,
        parentDocument: document,
        windowOptions: WINDOW_OPTIONS,
    };

    const childWindow = useChildWindow(CHILD_WINDOW_HOOK_OPTIONS);

    return (
        <button onClick={() => childWindow.launch()}>Launch</button>
        <button onClick={() => childWindow.launch(WINDOW_OPTIONS)}>Launch</button>
        <button onClick={() => childWindow.populate(<p>Hello World!</p>)}>Populate</button>
        <button onClick={() => childWindow.close()}>Close</button>
    );
}
`;

const WINDOW_NAME = "Child Window";
const HTML_URL = process.env.REACT_APP_CHILD_WINDOW_HTML;
const CSS_URL = process.env.REACT_APP_CHILD_WINDOW_CSS;
const DEFAULT_CHILD_BODY: string = "<p>Use textArea in the parent window to change me!</p>";
const INITIAL_CHILD_BODY: string = "<p>Hello World!</p>";

const ChildWindow: React.FC = () => {
    const [textAreaValue, setTextAreaValue] = useState<string>(INITIAL_CHILD_BODY);
    const [windowName, setWindowName] = useState<string>(WINDOW_NAME);
    const [htmlUrl, setHtmlUrl] = useState<string | undefined >(HTML_URL);
    const [cssUrl, setCssUrl] = useState<string | undefined>(CSS_URL);
    const [shouldInheritCSS, setInheritCss] = useState<boolean>(true);
    const [shouldInheritScripts, setInheritScripts] = useState<boolean>(true);
    const [shouldClosePreviousOnLaunch, setClosePrevious] = useState<boolean>(true);

    const WINDOW_OPTIONS: WindowOption = {
        name: windowName,
        url: htmlUrl,
    };

    const CHILD_WINDOW_HOOK_OPTIONS: IUseChildWindow = {
        cssUrl,
        name: windowName,
        parentDocument: document,
        shouldClosePreviousOnLaunch,
        shouldInheritCSS,
        shouldInheritScripts,
        windowOptions: WINDOW_OPTIONS,
    };

    const childWindow = useChildWindow(CHILD_WINDOW_HOOK_OPTIONS);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>useChildWindow</h1>
            <div className={styles.description}>
                This hook allows creating and managing child windows.
            </div>
            <div className={styles.description}>
                Try clicking on the buttons below to see child window actions.
            </div>
            <h2>Code Example</h2>
            <pre>
                <code className="language-jsx">
                    {codeExample}
                </code>
            </pre>
            <h2>Try it out</h2>
            <h4>Child Window Launch Configuration</h4>
            <input
                type="checkbox"
                name="should-close-previous"
                checked={shouldClosePreviousOnLaunch}
                onChange={() => setClosePrevious(!shouldClosePreviousOnLaunch)}
            />
            <label>Close existing windows with the same name on launch</label>
            <br />
            <input
                type="checkbox"
                name="should-inherit-css"
                checked={shouldInheritCSS}
                onChange={() => setInheritCss(!shouldInheritCSS)}
            />
            <label>Child window should inherit parent CSS</label>
            <br />
            <input
                type="checkbox"
                name="should-inherit-scripts"
                checked={shouldInheritScripts}
                onChange={() => setInheritScripts(!shouldInheritScripts)}
            />
            <label>Child window should inherit parent scripts</label>
            <br />
            <label>Child window name:</label>
            <input
                name="name"
                type="text"
                value={windowName}
                onChange={(e) => setWindowName(e.target.value)}
            />
            <br />
            <label>HTML URL for child window:</label>
            <input
                name="html-url"
                type="text"
                value={htmlUrl}
                onChange={(e) => setHtmlUrl(e.target.value)}
            />
            <br />
            <label>CSS URL for child window:</label>
            <input
                name="css-url"
                type="text"
                value={cssUrl}
                onChange={(e) => setCssUrl(e.target.value)}
            />
            <br />
            <label>HTML for child window body:</label>
            <textarea
                name="html"
                rows={5}
                cols={35}
                value={textAreaValue}
                onChange={(e) => setTextAreaValue(e.target.value)}
            >
            </textarea>
            <h4>Child Window Actions</h4>
            <button onClick={() => childWindow.launch()}>Launch</button>
            <button
                onClick={() => childWindow.populate(
                    ReactHtmlParser(textAreaValue ? textAreaValue : DEFAULT_CHILD_BODY),
                )}
                disabled={childWindow.state === "INITIAL"}
            >
                Populate
            </button>
            <button onClick={() => childWindow.close()} disabled={!childWindow.window}>Close</button>
        </div>
    );
};

export default ChildWindow;
