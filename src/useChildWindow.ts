import { WindowOption } from "openfin/_v2/api/window/windowOption";
import { useCallback, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { IUseChildWindowOptions } from "../index";
import { injectNode, injectNodes } from "./utils/helpers/inject";
import WINDOW_STATE from "./utils/types/enums/WindowState";
import { IChildWindow, ChildWindowV1, ChildWindowV2 } from "./utils/types/ChildWindows";

const Version = Object.freeze({
    one: 1,
    two: 2,
});

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
    const versionNum = fin.Window.getCurrentSync().getWebWindow ? Version.two : Version.one;
    const [childWindow, setChildWindow] = useState<IChildWindow>(versionNum === Version.one ? new ChildWindowV1() : new ChildWindowV2());

    const inheritScripts = useCallback(() => {
        const htmlDocument = childWindow.getHtmlDocument();
        if (parentDocument && htmlDocument) {
            const parentScripts = parentDocument.getElementsByTagName("script");
            injectNodes(parentScripts, htmlDocument);
        }
    }, [parentDocument, injectNodes, childWindow.htmlDocument]);

    const inheritCss = useCallback(() => {
        const htmlDocument = childWindow.getHtmlDocument();
        if (parentDocument && htmlDocument) {
            const externalStyles =  parentDocument.styleSheets;
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < externalStyles.length; i ++ ) {
                injectNode(externalStyles[i].ownerNode, htmlDocument);
            }
        }
    }, [parentDocument, injectNodes, childWindow.htmlDocument]);

    useEffect(() => {
        childWindow.setupListeners(setChildWindow);

        return () => {
            childWindow.removeListeners();
        };
    }, [childWindow.window]);

    useEffect(() => {
        if (shouldInheritCss) {
            inheritCss();
        }
        if (shouldInheritScripts) {
            inheritScripts();
        }

        const htmlDocument = childWindow.getHtmlDocument();
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
        childWindow.htmlDocument,
    ]);

    useEffect(() => {
        if (childWindow.state === WINDOW_STATE.LAUNCHED && jsx) {
            populate(jsx);
        }
    }, [childWindow.state, childWindow.htmlDocument]);

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

    const launch = useCallback(
        async (newWindowOptions?: WindowOption) => {
            const options = newWindowOptions
                ? newWindowOptions
                : windowOptions
                ? windowOptions
                : null;
            if (childWindow.state !== WINDOW_STATE.LAUNCHING && options) {
                try {
                    childWindow.setState(WINDOW_STATE.LAUNCHING, setChildWindow);
                    if (shouldClosePreviousOnLaunch) {
                        await closeExistingWindow();
                    }
                    await childWindow.create(options, setChildWindow);
                } catch (error) {
                    throw error;
                }
            }
        },
        [childWindow.state, closeExistingWindow],
    );

    const populate = useCallback(
        (jsxElement: JSX.Element) => {
            const htmlDocument = childWindow.getHtmlDocument();
            if (htmlDocument) {
                try {
                    childWindow.setState(WINDOW_STATE.POPULATING, setChildWindow);
                    ReactDOM.render(
                        jsxElement,
                        htmlDocument.getElementById("root"),
                    );
                    childWindow.setState(WINDOW_STATE.POPULATED, setChildWindow);
                } catch (error) {
                    throw error;
                }
            }
        },
        [childWindow.htmlDocument],
    );

    const close = useCallback(async () => {
        try {
            await childWindow.close(setChildWindow);
        } catch (error) {
            throw error;
        }
    }, [childWindow.window]);

    return {
        close,
        launch,
        populate,
        state: childWindow.state,
        windowRef: childWindow.window,
    };
};
