import React from "react";

const codeExample = `import {useNotification, IUseNotificationOptions} from "openfin-react-hooks";

const Component = () => {
    const NOTIFICATION_HOOK_OPTIONS: IUseNotificationOptions = {
      cssUrl: PATH_TO_NOTIFICATION_CSS,
      jsx: <p>I am a notification!</p>,
      parentDocument: document,
      shouldInheritCss: true,
      shouldInheritScripts: true,
    };

    const notification = useNotification(NOTIFICATION_HOOK_OPTIONS);

    return (
        <button onClick={() => notification.launch()}>Launch</button>
        <button onClick={() => notification.populate(<p>Hello World!</p>)}>Populate</button>
        <button onClick={() => notification.close()}>Close</button>
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
