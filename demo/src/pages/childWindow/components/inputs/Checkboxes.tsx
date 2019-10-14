import React, { Dispatch, SetStateAction } from "react";
import ILaunchConfig from "../../ILaunchConfig";

interface IProps {
  launchConfig: ILaunchConfig;
  setLaunchConfig: Dispatch<SetStateAction<ILaunchConfig>>;
}

export default ({ launchConfig, setLaunchConfig }: IProps) => (
  <div className="checkboxes">
    <input
      type="checkbox"
      name="should-close-previous"
      checked={launchConfig.shouldClosePreviousOnLaunch}
      onChange={() =>
        setLaunchConfig({
          ...launchConfig,
          shouldClosePreviousOnLaunch: !launchConfig.shouldClosePreviousOnLaunch,
        })
      }
    />
    <label>Close existing windows with the same name on launch</label>
    <br />
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
      {<code> CHILD_WINDOW_HOOK_OPTIONS </code>}
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
    <label>Child window should inherit parent CSS</label>
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
    <label>Child window should inherit parent scripts</label>
  </div>
);
