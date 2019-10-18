import React, { Dispatch, SetStateAction } from "react";
import ILaunchConfig from "../../interfaces/ILaunchConfig";

interface IProps {
  launchConfig: ILaunchConfig;
  setLaunchConfig: Dispatch<SetStateAction<ILaunchConfig>>;
}

export default ({ launchConfig, setLaunchConfig }: IProps) => (
  <div className="checkboxes">
    <input
      type="checkbox"
      name="should-load-jsx-after-launch"
      checked={launchConfig.shouldLoadJsxAfterLaunch}
      onChange={() =>
        setLaunchConfig({
          ...launchConfig,
          shouldLoadJsxAfterLaunch: !launchConfig.shouldLoadJsxAfterLaunch,
        })
      }
    />
    <label>
      Should load {<code>jsx</code>} passed as a part of
      {<code> NOTIFICATION_HOOK_OPTIONS </code>}
      immediately after the window is launched
    </label>
    <br />
    <input
      type="checkbox"
      name="should-inherit-css"
      checked={launchConfig.shouldInheritCss}
      onChange={() =>
        setLaunchConfig({
          ...launchConfig,
          shouldInheritCss: !launchConfig.shouldInheritCss,
        })
      }
    />
    <label>Notification should inherit parent CSS</label>
    <br />
    <input
      type="checkbox"
      name="should-inherit-scripts"
      checked={launchConfig.shouldInheritScripts}
      onChange={() =>
        setLaunchConfig({
          ...launchConfig,
          shouldInheritScripts: !launchConfig.shouldInheritScripts,
        })
      }
    />
    <label>Notification should inherit parent scripts</label>
  </div>
);
