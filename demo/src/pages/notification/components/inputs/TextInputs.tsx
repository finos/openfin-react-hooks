import React, { Dispatch, SetStateAction } from "react";

interface IProps {
  textAreaValue: string;
  setTextAreaValue: Dispatch<SetStateAction<string>>;
}

export default ({ textAreaValue, setTextAreaValue }: IProps) => (
  <div className="input-fields">
    {/* <label>HTML URL for child window:</label>
    <input
      name="html-url"
      type="text"
      value={htmlUrl}
      onChange={(e) =>
        setLaunchConfig({ ...launchConfig, htmlUrl: e.target.value })
      }
    />
    <br />
    <label>CSS URL for child window:</label>
    <input
      name="css-url"
      type="text"
      value={launchConfig.cssUrl}
      onChange={(e) =>
        setLaunchConfig({ ...launchConfig, cssUrl: e.target.value })
      }
    /> */}
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
