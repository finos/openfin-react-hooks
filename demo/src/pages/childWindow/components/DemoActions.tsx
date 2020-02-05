import { IUseChildWindowOptions, useChildWindow, useChildWindowV1 } from "openfin-react-hooks";
import React, { useState, useEffect } from "react";
import ReactHtmlParser from "react-html-parser";

interface IProps {
    CHILD_WINDOW_HOOK_OPTIONS: IUseChildWindowOptions;
    textAreaValue: string;
}
const NOTE: string = `Note: You need to relaunch the window if you want the
 changes you make to "Child Window Configuration" to take place`;
const DEFAULT_CHILD_BODY: JSX.Element = (
    <p>Use textArea in the parent window to change me!</p>
);

export default ({ CHILD_WINDOW_HOOK_OPTIONS, textAreaValue }: IProps) => {
    const childWindowV2 = useChildWindow(CHILD_WINDOW_HOOK_OPTIONS);
    const childWindowV1 = useChildWindowV1(CHILD_WINDOW_HOOK_OPTIONS);
    const [childWindow, setChildWindow] = useState<any>({ launch: ()=> {}, populate: (_1: any) => {}, close: () => {}, windowRef: false, state: "INITIAL"});
    useEffect(() => {
        console.log("useEffect");
        fin.System.getVersion().then((fullVersion) => {
            const versions = fullVersion.split(".");
            const jsApiFullVersion = parseInt(versions[2]);
            if (jsApiFullVersion < 39) {
                console.log("V1");
                setChildWindow(childWindowV1);
            } else {
                console.log("V2");
                setChildWindow(childWindowV2);
            }
        });
    }, [CHILD_WINDOW_HOOK_OPTIONS]);
    console.log(childWindow);
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
