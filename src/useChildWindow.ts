// import { _Window } from "openfin/_v2/api/window/window";
import { WindowOption } from "openfin/_v2/api/window/windowOption";
import { useCallback, useEffect, useReducer, useState } from "react";
import ReactDOM from "react-dom";
import { IUseChildWindowOptions } from "../index";
import { injectNode, injectNodes } from "./utils/helpers/inject";
import reducer, { INITIAL_WINDOW_STATE } from "./utils/reducers/WindowReducer";
import WINDOW_ACTION from "./utils/types/enums/WindowAction";
import WINDOW_STATE from "./utils/types/enums/WindowState";

export default ({
    name,
    windowOptions,
    parentDocument,
    cssUrl,
    jsx,
    shouldClosePreviousOnLaunch,
    shouldInheritCss,
    shouldInheritScripts,
}: IUseChildWindowOptions) => {
    const [versionNum, setVersionNum] = useState<number | null>(null);
    const [childWindow, dispatch] = useReducer(reducer, INITIAL_WINDOW_STATE);
    const [htmlDocument, setHtmlDocument] = useState<HTMLDocument | null>(null);

    fin.System.getVersion().then((fourPartVersion) => {
        const allVersions = fourPartVersion.split(".");
        const jsFullVersion = allVersions[2];
        const jsShortVersion = parseInt(jsFullVersion, 10) < 39 ? 1 : 2;
        setVersionNum(jsShortVersion);
    });

    const inheritScripts = useCallback(() => {
        if (parentDocument && htmlDocument) {
            const parentScripts = parentDocument.getElementsByTagName("script");
            injectNodes(parentScripts, htmlDocument);
        }
    }, [parentDocument, injectNodes, htmlDocument]);

    const inheritCss = useCallback(() => {
        if (parentDocument && htmlDocument) {
            const externalStyles =  parentDocument.styleSheets;
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < externalStyles.length; i ++ ) {
                injectNode(externalStyles[i].ownerNode, htmlDocument);
            }
        }
    }, [parentDocument, injectNodes, htmlDocument]);

    const reset = () => {
        dispatch({ type: WINDOW_ACTION.RESET });
        setHtmlDocument(null);
    };

    useEffect(() => {
        if (childWindow.windowRefV1 && versionNum === 1) {
            setHtmlDocument(childWindow.windowRefV1.getNativeWindow().document);
            childWindow.windowRefV1.getNativeWindow().onclose = reset;
        } else if (childWindow.windowRefV2 && versionNum === 2) {
            setHtmlDocument(childWindow.windowRefV2.getWebWindow().document);
            childWindow.windowRefV2.addListener("closed", reset);
            childWindow.windowRefV2.removeListener("closed", reset);
        }
        return () => {
            if (childWindow.windowRefV1) {
                childWindow.windowRefV1.getNativeWindow().onclose = null;
            } else if (childWindow.windowRefV2) {
                childWindow.windowRefV2.removeListener("closed", reset);
            }
        };
    }, [childWindow.windowRefV1, childWindow.windowRefV2, versionNum]);

    useEffect(() => {
        if (shouldInheritCss) {
            inheritCss();
        }
        if (shouldInheritScripts) {
            inheritScripts();
        }

        if (cssUrl && htmlDocument) {
            const linkElement = htmlDocument.createElement("link");
            linkElement.setAttribute("rel", "stylesheet");
            linkElement.setAttribute("href", cssUrl);
            injectNode(linkElement, htmlDocument);
        }
    }, [
        cssUrl,
        parentDocument,
        inheritCss,
        inheritScripts,
        injectNode,
        htmlDocument,
    ]);

    useEffect(() => {
        if (childWindow.state === WINDOW_STATE.LAUNCHED && jsx) {
            populate(jsx);
        }
    }, [childWindow.state]);

    const closeExistingWindow = useCallback(async () => {
        const application = await fin.Application.getCurrent();
        const childWindows = await application.getChildWindows();

        await Promise.all(
            childWindows.map((win) =>
                win.identity.name && win.identity.name === name
                    ? win.close()
                    : Promise.resolve(),
            ),
        );
    }, [name]);

    const dispatchError = (error: string) => {
        dispatch({
            error,
            payload: WINDOW_STATE.ERROR,
            type: WINDOW_ACTION.CHANGE_STATE,
        });
    };

    const dispatchNewState = (state: WINDOW_STATE) =>
        dispatch({
            payload: state,
            type: WINDOW_ACTION.CHANGE_STATE,
        });

    const launch = useCallback(
        async (newWindowOptions?: WindowOption) => {
            const options = newWindowOptions
                ? newWindowOptions
                : windowOptions
                ? windowOptions
                : null;
            if (childWindow.state !== WINDOW_STATE.LAUNCHING && options) {
                try {
                    dispatchNewState(WINDOW_STATE.LAUNCHING);
                    if (shouldClosePreviousOnLaunch) {
                        await closeExistingWindow();
                    }
                    if (versionNum === 1) {
                        dispatch({
                            payload: new fin.desktop.Window(options),
                            type: WINDOW_ACTION.SET_V1_WINDOW,
                        });
                    } else if (versionNum === 2) {
                        dispatch({
                            payload: await fin.Window.create(options),
                            type: WINDOW_ACTION.SET_V2_WINDOW,
                        });
                    }
                    dispatchNewState(WINDOW_STATE.LAUNCHED);
                } catch (error) {
                    dispatchError(error);
                }
            }
        },
        [childWindow.state, closeExistingWindow, versionNum],
    );

    const populate = useCallback(
        (jsxElement: JSX.Element) => {
            if (htmlDocument) {
                try {
                    dispatchNewState(WINDOW_STATE.POPULATING);
                    ReactDOM.render(
                        jsxElement,
                        htmlDocument.getElementById("root"),
                    );
                    dispatchNewState(WINDOW_STATE.POPULATED);
                } catch (error) {
                    dispatchError(error);
                }
            }
        },
        [htmlDocument],
    );

    const close = useCallback(async () => {
        try {
            if (childWindow.windowRefV1) {
                await childWindow.windowRefV1.close();
            }
            if (childWindow.windowRefV2) {
                await childWindow.windowRefV2.close();
            }
            reset();
        } catch (error) {
            dispatchError(error);
        }
    }, [childWindow.windowRefV1, childWindow.windowRefV2, versionNum]);

    return {
        close,
        launch,
        populate,
        state: childWindow.state,
        windowRef: versionNum === 1 ? childWindow.windowRefV1 : childWindow.windowRefV2,
    };
};
