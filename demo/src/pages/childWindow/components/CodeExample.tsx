import React from "react";

const codeExample = `import {useChildWindow} from "openfin-react-hooks";

const Component = () => {
    const WINDOW_OPTIONS: WindowOption = {
        name: WINDOW_NAME,
        url: PATH_TO_CHILD_WINDOW_HTML,
    };

    const CHILD_WINDOW_HOOK_OPTIONS: IUseChildWindowOptions = {
        cssUrl: PATH_TO_CHILD_WINDOW_CSS,
        jsx: <p>I am a child window!</p>
        name: WINDOW_NAME,
        shouldClosePreviousOnLaunch: true,
        shouldInheritCss: true,
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

export default () => (
  <>
    <h2>Code Example</h2>
    <pre>
      <code className="language-jsx">{codeExample}</code>
    </pre>
  </>
);
