import React, { Dispatch, SetStateAction } from "react";
import ILaunchConfig from "../../ILaunchConfig";

interface IProps {
    launchConfig: ILaunchConfig;
    setLaunchConfig: Dispatch<SetStateAction<ILaunchConfig>>;
    textAreaValue: string;
    setTextAreaValue: Dispatch<SetStateAction<string>>;
}

export default ({
    launchConfig,
    setLaunchConfig,
    textAreaValue,
    setTextAreaValue,
}: IProps) => (
        <div className="input-fields">
            <label>Child window name:</label>
            <input
                name="name"
                type="text"
                value={launchConfig.windowName}
                onChange={(e) =>
                    setLaunchConfig({ ...launchConfig, windowName: e.target.value })
                }
            />
            <br />
            <label>HTML URL for child window:</label>
            <input
                name="html-url"
                type="text"
                value={launchConfig.htmlUrl}
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
            />
            <h4>Child Window Body</h4>
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
