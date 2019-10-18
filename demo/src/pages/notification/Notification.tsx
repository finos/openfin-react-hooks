import * as Prism from "prismjs";
import React, { useEffect, useState } from "react";
import { IUseNotificationOptions } from "../../../..";
import Demo from "../../common/Demo";
import LaunchConfiguration from "../../common/LaunchConfiguration";
import CodeExample from "./components/CodeExample";
import DemoActions from "./components/DemoActions";
import Checkboxes from "./components/inputs/Checkboxes";
import TextInputs from "./components/inputs/TextInputs";
import ILaunchConfig from "./interfaces/ILaunchConfig";
import styles from "./Notification.module.css";

const HTML_URL: string | undefined = process.env.REACT_APP_SAMPLE_WINDOW_HTML;
const CSS_URL: string | undefined =
  process.env.REACT_APP_SAMPLE_NOTIFICATION_CSS;
const INITIAL_TEXT_AREA_VALUE: string = `<div class="App_containerApp__F0W0w">
  <p>Hello World!</p>
</div>`;
const NOTIFICATION_BODY_AS_HOOK_OPTION = (
  <div className="App_containerApp__F0W0w">
    <p>
      This jsx was passed in as a part of <code>NOTIFICATION_HOOK_OPTIONS</code>
      . See "Code Example" Section for more information.
    </p>
  </div>
);
const INITIAL_NOTIFICATION_OPTIONS: ILaunchConfig = {
  cssUrl: CSS_URL,
  notificationOptions: {
    message: null,
    timeout: "never",
    url: HTML_URL,
  },
  shouldInheritCss: true,
  shouldInheritScripts: true,
  shouldLoadJsxAfterLaunch: true,
};

const Notification: React.FC = () => {
  useEffect(Prism.highlightAll, []);

  const [launchConfig, setLaunchConfig] = useState<ILaunchConfig>(
    INITIAL_NOTIFICATION_OPTIONS,
  );

  const [textAreaValue, setTextAreaValue] = useState<string>(
    INITIAL_TEXT_AREA_VALUE,
  );

  const NOTIFICATION_HOOK_OPTIONS: IUseNotificationOptions = {
    cssUrl: launchConfig.cssUrl,
    jsx: launchConfig.shouldLoadJsxAfterLaunch
      ? NOTIFICATION_BODY_AS_HOOK_OPTION
      : undefined,
    notificationOptions: launchConfig.notificationOptions,
    parentDocument: document,
    shouldInheritCss: launchConfig.shouldInheritCss,
    shouldInheritScripts: launchConfig.shouldInheritScripts,
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>useBounds</h1>
      <div className={styles.description}>
        This hook returns the current (and future) bounds of the provided
        window.
      </div>
      <div className={styles.description}>
        Try moving / resizing this window to see how the bounds object
        automatically updates.
      </div>
      <CodeExample />
      <Demo>
        <LaunchConfiguration>
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
        </LaunchConfiguration>
        <DemoActions
          textAreaValue={textAreaValue}
          NOTIFICATION_HOOK_OPTIONS={NOTIFICATION_HOOK_OPTIONS}
        />
      </Demo>
    </div>
  );
};

export default Notification;
