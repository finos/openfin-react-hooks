import React, { Dispatch, SetStateAction } from "react";

interface IProps {
  textAreaValue: string;
  setTextAreaValue: Dispatch<SetStateAction<string>>;
  launchConfig: any;
  setLaunchConfig: Dispatch<SetStateAction<any>>;
}

export default ({
  textAreaValue,
  setTextAreaValue,
  launchConfig,
  setLaunchConfig,
}: IProps) => (
  <div className="input-fields">
    <label>HTML URL for child window:</label>
    <input
      name="html-url"
      type="text"
      value={launchConfig.notificationOptions.url}
      onChange={(e) =>
        setLaunchConfig({
          ...launchConfig,
          notificationOptions: {
            ...launchConfig.notificationOptions,
            url: e.target.value,
          },
        })
      }
    />
    <label>CSS URL for child window:</label>
    <input
      name="css-url"
      type="text"
      value={launchConfig.cssUrl}
      onChange={(e) =>
        setLaunchConfig({ ...launchConfig, cssUrl: e.target.value })
      }
    />
    <label>Timeout</label>
    <input
      name="html-url"
      type="text"
      value={launchConfig.notificationOptions.timeout}
      onChange={(e) =>
        setLaunchConfig({
          ...launchConfig,
          notificationOptions: {
            ...launchConfig.notificationOptions,
            timeout: e.target.value,
          },
        })
      }
    />
    <h4>Notification Body</h4>
    <label>
      HTML for child window body (to be used as an argument to populate function
      call):
    </label>
    <textarea
      name="html"
      rows={5}
      cols={40}
      value={textAreaValue}
      onChange={(e) => setTextAreaValue(e.target.value)}
    ></textarea>
  </div>
);
