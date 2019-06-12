import {useUserMovement} from "openfin-react-hooks";
import * as Prism from "prismjs";
import React, {useEffect} from "react";
import Switch from "react-switch";
import useWindow from "../../common/useCreateWindow";

import styles from "./UserMovement.module.css";

const codeExample = `import {useUserMovement} from "openfin-react-hooks";

const Component = () => {
    const [isEnabled, setIsEnabled] = useUserMovement(win);

    return (
        <div>
            <div>Window has user movement <strong>{isEnabled ? "enabled" : "disabled"}</strong></div>
            <h3>Enable user movement</h3>
            <Switch onChange={(checked) => setIsEnabled(checked)} checked={isEnabled} />
        </div>
    );
}
`;

const UserMovement: React.FC = () => {
    const [win] = useWindow();
    const [isEnabled, setIsEnabled] = useUserMovement(win);

    useEffect(Prism.highlightAll, []);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>useUserMovement</h1>
            <div className={styles.description}>
                This hook returns whether or not the current window has user movement enabled or disabled
            </div>
            <div className={styles.description}>
                Disabling user movement prevents the user from moving the window around the screen.
            </div>
            <div className={styles.description}>
                You can also programmatically change whether or not user movement is enabled.
            </div>
            <div className={styles.description}>
                Try attempting to move the pop-out window when user movement has been enabled / disabled.
            </div>
            <h2>Code Example</h2>
            <pre>
                <code className="language-jsx">
                    {codeExample}
                </code>
            </pre>
            <h2>Try it out</h2>
            <div>Window has user movement <strong>{isEnabled ? "enabled" : "disabled"}</strong></div>
            <h3>Enable user movement</h3>
            <Switch onChange={(checked) => setIsEnabled(checked)} checked={isEnabled}/>
        </div>
    );
};

export default UserMovement;
