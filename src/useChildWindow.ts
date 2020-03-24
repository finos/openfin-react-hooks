import { _Window } from "openfin/_v2/api/window/window";
import { WindowOption } from "openfin/_v2/api/window/windowOption";
import { useCallback, useEffect, useReducer, useState } from "react";
import ReactDOM from "react-dom";

import { IUseChildWindowOptions } from "../index";
import createWindow from "./utils/helpers/createWindow";
import getChildWindows from "./utils/helpers/getChildWindows";
import { injectNode, injectNodes } from "./utils/helpers/inject";
import { isWindowV1, isWindowV2 } from "./utils/helpers/isWindow";
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
    const [childWindow, dispatch] = useReducer(reducer, INITIAL_WINDOW_STATE);
    const [htmlDocument, setHtmlDocument] = useState<HTMLDocument | null>(null);
    const version = fin.Window.getCurrentSync().getWebWindow ?
        OpenFinJavaScriptAPIVersion.TWO : OpenFinJavaScriptAPIVersion.ONE;

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

    const reset = async () =>
        new Promise((resolve) => {
            dispatch({ type: WINDOW_ACTION.RESET });
            setHtmlDocument(null);
            resolve();
        });

    useEffect(() => {
        if (childWindow.windowRef && isWindowV1(childWindow.windowRef)) {
            setHtmlDocument(childWindow.windowRef.getNativeWindow().document);
            childWindow.windowRef.getNativeWindow().onclose = reset;
        } else if (childWindow.windowRef && isWindowV2(childWindow.windowRef)) {
            setHtmlDocument(childWindow.windowRef.getWebWindow().document);
            childWindow.windowRef.addListener("closed", reset);
            childWindow.windowRef.removeListener("closed", reset);
        }

        return () => {
            if (childWindow.windowRef && isWindowV1(childWindow.windowRef)) {
                const nativeWindow = childWindow.windowRef.getNativeWindow();
                if (nativeWindow) {
                    nativeWindow.onclose = null;
                }
            } else if (childWindow.windowRef && isWindowV2(childWindow.windowRef)) {
                childWindow.windowRef.removeListener("closed", reset);
            }
        };
    }, [childWindow.windowRef, version]);

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
        const windowsToClose: Array<fin.OpenFinWindow | _Window> = await getChildWindows(version);
        if (version === OpenFinJavaScriptAPIVersion.ONE) {
            await Promise.all(
                windowsToClose.map((windowToClose: any) =>
                    (windowToClose.name && windowToClose.name === name)
                        ? new Promise((resolve, reject) => {
                            windowToClose.close(true, resolve, reject); })
                        : Promise.resolve()));

        } else if (version === OpenFinJavaScriptAPIVersion.TWO) {
            await Promise.all(
                windowsToClose.map((windowToClose: any) =>
                    (windowToClose.identity.name && windowToClose.identity.name === name)
                        ? windowToClose.close()
                        : Promise.resolve()));
        }
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
                    createWindow(version, options)
                        .then((newWindow) => {
                            dispatch({
                                payload: newWindow,
                                type: WINDOW_ACTION.SET_WINDOW,
                            });
                            dispatchNewState(WINDOW_STATE.LAUNCHED);
                        })
                        .catch(dispatchError);
                } catch (error) {
                    dispatchError(error);
                }
            }
        },
        [childWindow.state, closeExistingWindow, version],
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
            if (childWindow.windowRef) {
                await childWindow.windowRef.close();
            }
            await reset();
        } catch (error) {
            dispatchError(error);
        }
    }, [childWindow.windowRef]);

    return {
        close,
        launch,
        populate,
        state: childWindow.state,
        windowRef: childWindow.windowRef,
    };
};
