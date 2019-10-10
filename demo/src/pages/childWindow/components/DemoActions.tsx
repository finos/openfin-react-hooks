import { IUseChildWindowOptions, useChildWindow } from "openfin-react-hooks";
import React from "react";
import ReactHtmlParser from "react-html-parser";

interface IProps {
  CHILD_WINDOW_HOOK_OPTIONS: IUseChildWindowOptions;
  textAreaValue: string;
}
const NOTE: string = `Note: You need to relaunch the window if you want the
 changes you make to <code>Child Window Configuration</code> to take place`;
const DEFAULT_CHILD_BODY: JSX.Element = (
  <p>Use textArea in the parent window to change me!</p>
);

export default ({ CHILD_WINDOW_HOOK_OPTIONS, textAreaValue }: IProps) => {
  const childWindow = useChildWindow(CHILD_WINDOW_HOOK_OPTIONS);
  return (
    <>
      <h4>Child Window Actions</h4>
      <h5>{NOTE}</h5>
      <button onClick={() => childWindow.launch()}>Launch</button>
      <button
        onClick={() =>
          childWindow.populate(
            textAreaValue ? (
              <>{ReactHtmlParser(textAreaValue)}</>
            ) : (
              DEFAULT_CHILD_BODY
            ),
          )
        }
        disabled={childWindow.state === "INITIAL"}
      >
        Populate
      </button>
      <button
        onClick={() => childWindow.close()}
        disabled={!childWindow.windowRef}
      >
        Close
      </button>
    </>
  );
};
