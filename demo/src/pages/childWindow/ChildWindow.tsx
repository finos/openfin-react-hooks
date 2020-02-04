import { IUseChildWindowOptions } from "openfin-react-hooks";
import { WindowOption } from "openfin/_v2/api/window/windowOption";
import * as Prism from "prismjs";
import React, { useEffect, useState } from "react";
import Demo from "../../common/Demo";
import styles from "./ChildWindow.module.css";
import CodeExample from "./components/CodeExample";
import DemoActions from "./components/DemoActions";
import HookDescription from "./components/HookDescription";
import Checkboxes from "./components/inputs/Checkboxes";
import TextInputs from "./components/inputs/TextInputs";
import ILaunchConfig from "./ILaunchConfig";

const WINDOW_HEIGHT: number = 500;
const WINDOW_NAME: string = "Child Window";
const HTML_URL: string | undefined = process.env.REACT_APP_SAMPLE_WINDOW_HTML;
const CSS_URL: string | undefined = process.env.REACT_APP_SAMPLE_WINDOW_CSS;
const INITIAL_TEXT_AREA_VALUE: string = `<div class="App_containerApp__F0W0w">
  <p>Hello World!</p>
</div>`;
const CHILD_BODY_AS_HOOK_OPTION = (
    <div className="App_containerApp__F0W0w">
        <p className="ChildWindow_external_style__2s3g_">
            This jsx was passed in as a part of <code>CHILD_WINDOW_HOOK_OPTIONS</code>
            . See "Code Example" Section for more information.
    </p>
    </div>
);

const ChildWindow: React.FC = () => {
    const [textAreaValue, setTextAreaValue] = useState<string>(
        INITIAL_TEXT_AREA_VALUE,
    );

    const [launchConfig, setLaunchConfig] = useState<ILaunchConfig>({
        cssUrl: CSS_URL,
        htmlUrl: HTML_URL,
        shouldClosePreviousOnLaunch: true,
        shouldInheritCss: true,
        shouldInheritScripts: true,
        shouldLoadJsxAfterLaunch: true,
        windowName: WINDOW_NAME,
    });

    useEffect(Prism.highlightAll, []);

    const WINDOW_OPTIONS: WindowOption = {
        maxHeight: WINDOW_HEIGHT,
        maxWidth: WINDOW_HEIGHT,
        minHeight: WINDOW_HEIGHT,
        minWidth: WINDOW_HEIGHT,
        name: launchConfig.windowName,
        url: launchConfig.htmlUrl,
        waitForPageLoad: true,
    };

    const CHILD_WINDOW_HOOK_OPTIONS: IUseChildWindowOptions = {
        cssUrl: launchConfig.cssUrl,
        jsx: launchConfig.shouldLoadJsxAfterLaunch
            ? CHILD_BODY_AS_HOOK_OPTION
            : undefined,
        name: launchConfig.windowName,
        parentDocument: document,
        shouldClosePreviousOnLaunch: launchConfig.shouldClosePreviousOnLaunch,
        shouldInheritCss: launchConfig.shouldInheritCss,
        shouldInheritScripts: launchConfig.shouldInheritScripts,
        windowOptions: WINDOW_OPTIONS,
    };

    return (
        <div className={styles.container}>
            <HookDescription />
            <CodeExample />
            <Demo>
                <Checkboxes
                    launchConfig={launchConfig}
                    setLaunchConfig={setLaunchConfig}
                />
                <TextInputs
                    launchConfig={launchConfig}
                    setLaunchConfig={setLaunchConfig}
                    textAreaValue={textAreaValue}
                    setTextAreaValue={setTextAreaValue}
                />
                <DemoActions
                    CHILD_WINDOW_HOOK_OPTIONS={CHILD_WINDOW_HOOK_OPTIONS}
                    textAreaValue={textAreaValue}
                />
            </Demo>
        </div>
    );
};

export default ChildWindow;
