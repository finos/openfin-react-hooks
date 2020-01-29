import _NotificationModule, {
    _Notification,
} from "openfin/_v2/api/notification/notification";
import { _Window } from "openfin/_v2/api/window/window";
import { WindowOption } from "openfin/_v2/api/window/windowOption";
import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useReducer,
    useState,
} from "react";
import ReactDOM from "react-dom";
import { IUseNotificationOptions } from "../index";
import { injectNode, injectNodes } from "./utils/helpers/inject";
import reducer, { INITIAL_WINDOW_STATE } from "./utils/reducers/WindowReducer";
import WINDOW_ACTION from "./utils/types/enums/WindowAction";
import WINDOW_STATE from "./utils/types/enums/WindowState";

interface INoteWin extends _Window {
    windowOpts: WindowOption;
}

// This is a work-around regarding fin.OpenFinNotification interface not defining noteWin
interface IOpenFinNotification extends _Notification {
    noteWin?: INoteWin;
}

export default ({
    parentDocument,
    cssUrl,
    notificationOptions,
    jsx,
    shouldInheritCss,
    shouldInheritScripts,
}: IUseNotificationOptions) => {
    const [name, setName] = useState<string | null>(null);
    const [htmlDocument, setHtmlDocument] = useState<HTMLDocument | null>(null);
    const [populateJsx, setPopulateJsx] = useState<JSX.Element | null>(null);
    const [ref, setRef] = useState<IOpenFinNotification | null>(null);
    const [notificationWindow, dispatch] = useReducer(
        reducer,
        INITIAL_WINDOW_STATE,
    );
    const inheritScripts = useCallback(() => {
        if (parentDocument && htmlDocument) {
            const parentScripts = parentDocument.getElementsByTagName("script");
            injectNodes(parentScripts, htmlDocument);
        }
    }, [parentDocument, injectNodes]);

    const inheritCss = useCallback(() => {
        if (parentDocument && htmlDocument) {
            const parentStyles = parentDocument.getElementsByTagName("style");
            injectNodes(parentStyles, htmlDocument);
        }
    }, [parentDocument, injectNodes, htmlDocument]);

    useEffect(() => {
        if (notificationWindow.windowRef) {
            setHtmlDocument(
                notificationWindow.windowRef.getWebWindow().document,
            );
        }
    }, [notificationWindow.windowRef]);

    useEffect(() => {
        if (
            name &&
            ref &&
            notificationWindow.state === WINDOW_STATE.LAUNCHING
        ) {
            fin.Application.getCurrent().then(async (application) => {
                const childWindows = await application.getChildWindows();
                childWindows.map((win) => {
                    if (win.identity.name && win.identity.name === name) {
                        dispatch({
                            payload: win,
                            type: WINDOW_ACTION.SET_WINDOW,
                        });
                    }
                });
                dispatchNewState(WINDOW_STATE.LAUNCHED);
            });
        }
    }, [name, notificationWindow.state, ref]);

    useEffect(() => {
        if (ref && ref.noteWin) {
            setName(ref.noteWin.windowOpts.name || null);
        }
    }, [ref]);

    useLayoutEffect(() => {
        const jsxElement = populateJsx ? populateJsx : jsx;
        if (
            jsxElement &&
            notificationWindow.state === "LAUNCHED" &&
            htmlDocument
        ) {
            populate(jsxElement);
        }
    }, [jsx, populateJsx, name, notificationWindow]);

    useEffect(() => {
        if (shouldInheritCss) {
            inheritCss();
        }
    }, [shouldInheritCss, parentDocument, inheritCss]);

    useEffect(() => {
        if (shouldInheritScripts) {
            inheritScripts();
        }
    }, [shouldInheritScripts, parentDocument, inheritScripts]);

    useEffect(() => {
        if (cssUrl && htmlDocument) {
            const linkElement = htmlDocument.createElement("link");
            linkElement.setAttribute("rel", "stylesheet");
            linkElement.setAttribute("href", cssUrl);
            injectNode(linkElement, htmlDocument);
        }
    }, [notificationWindow, cssUrl, injectNode, htmlDocument]);

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
    }, [cssUrl, inheritCss, inheritScripts, injectNode, htmlDocument]);

    const dispatchNewState = (state: WINDOW_STATE) =>
        dispatch({
            payload: state,
            type: WINDOW_ACTION.CHANGE_STATE,
        });

    const dispatchError = (error: string) => {
        dispatch({
            error,
            payload: WINDOW_STATE.ERROR,
            type: WINDOW_ACTION.CHANGE_STATE,
        });
    };

    const reset = () => {
        dispatch({ type: WINDOW_ACTION.RESET });
        setHtmlDocument(null);
        setRef(null);
    };

    const close = useCallback(async () => {
        try {
            if (ref) {
                await ref.close();
            }
            reset();
        } catch (error) {
            throw new Error(error);
        }
    }, [ref]);

    const launch = useCallback(
        async (currentNotificationOpts?: fin.NotificationOptions) => {
            const options = currentNotificationOpts
                ? currentNotificationOpts
                : notificationOptions;
            console.log(options);

            const notification = window.fin.Notification.create({
                url: 'https://cdn.openfin.co/docs/javascript/stable/tutorial-Notification.create.html',
                timeout: 3000
            }); // .then(() => console.log('Notification created')).catch(err => console.log(err));

            try {
                console.log("SHOW");
                // notification.show().then(console.log).catch(console.error);
                const message = await notification.sendMessage("hello");
                console.log(message);
                // .then(console.log).catch(console.error)

                const customShow = () => {
                    return new Promise((resolve, reject) => {
                        window.setTimeout(() => {
                            reject("TIMEOUT ERROR")
                        }, 1)
                        notification.show().then(resolve).catch(reject);
                    })
                }

                await customShow().catch(console.error);
                // .then(() => console.log('bla0'))
                // .catch(() => console.log('blaErr'));

                console.log("blah");
                const newNotification = window.fin.Notification
                    .create(options)
                console.log(newNotification);

                newNotification.sendMessage("HELLO");
                newNotification.show()
                    .then(() => {
                        console.log("Launching new notification...");
                        dispatchNewState(WINDOW_STATE.LAUNCHING);
                    })
                    .catch((error: Error) => { throw error; });

                setRef(newNotification);
            } catch (error) {
                console.log("ERROR")
                console.log(error);
                dispatchError(error);
            }
        },
        [],
    );

    console.log(launch)

    const populate = useCallback(
        (jsxElement: JSX.Element) => {
            setPopulateJsx(jsxElement);
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

    return {
        close,
        launch,
        populate,
        ref,
        state: notificationWindow.state,
        windowRef: notificationWindow.windowRef,
    };
};
