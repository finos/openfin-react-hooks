import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useReducer,
  useState,
} from "react";
import ReactDOM from "react-dom";
import { IUseNotificationOptions } from "../index";
import reducer, { INITIAL_WINDOW_STATE } from "./utils/reducers/WindowReducer";
import WINDOW_ACTION from "./utils/types/enums/WindowAction";
import WINDOW_STATE from "./utils/types/enums/WindowState";

export default ({
  parentDocument,
  cssUrl,
  notificationOptions,
  jsx,
  shouldInheritCss,
  shouldInheritScripts,
}: IUseNotificationOptions) => {
  const [ref, setRef] = useState<any>(null);
  const [notificationWindow, dispatch] = useReducer(
    reducer,
    INITIAL_WINDOW_STATE,
  );
  const [name, setName] = useState<string | null>(null);

  const injectNode = useCallback(
    (node: HTMLStyleElement | HTMLScriptElement) => {
      if (notificationWindow && notificationWindow.windowRef) {
        notificationWindow.windowRef
          .getWebWindow()
          .document.getElementsByTagName("head")[0]
          .appendChild(node.cloneNode(true));
      }
    },
    [notificationWindow.windowRef],
  );

  const injectNodes = useCallback(
    (nodes: HTMLCollectionOf<HTMLStyleElement | HTMLScriptElement>) => {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < nodes.length; i++) {
        injectNode(nodes[i]);
      }
    },
    [injectNode],
  );

  const inheritScripts = useCallback(() => {
    if (parentDocument) {
      const parentScripts = parentDocument.getElementsByTagName("script");
      injectNodes(parentScripts);
    }
  }, [parentDocument, injectNodes]);

  const inheritCss = useCallback(() => {
    if (parentDocument) {
      const parentStyles = parentDocument.getElementsByTagName("style");
      injectNodes(parentStyles);
    }
  }, [parentDocument, injectNodes]);

  useEffect(() => {
    if (name && notificationWindow.state === WINDOW_STATE.LAUNCHED) {
      fin.Application.getCurrent().then((application) =>
        application.getChildWindows().then((childWindows) => {
          childWindows.map((win) => {
            if (win.identity.name && win.identity.name === name) {
              dispatch({
                payload: win,
                type: WINDOW_ACTION.SET_WINDOW,
              });
            }
          });
        }),
      );
    }
  }, [name, notificationWindow.state, ref]);

  useEffect(() => {
    if (ref) {
      setName(ref.noteWin.windowOpts.name);
    }
  }, [ref, setRef]);

  useLayoutEffect(() => {
    if (
      jsx &&
      notificationWindow.state === "LAUNCHED" &&
      notificationWindow.windowRef
    ) {
      populate(jsx);
    }
  }, [jsx, name, notificationWindow]);

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
    if (cssUrl && notificationWindow.windowRef) {
      const linkElement = notificationWindow.windowRef
        .getWebWindow()
        .document.createElement("link");
      linkElement.setAttribute("rel", "stylesheet");
      linkElement.setAttribute("href", cssUrl);
      injectNode(linkElement);
    }
  }, [notificationWindow, cssUrl, injectNode]);

  useEffect(() => {
    if (shouldInheritCss) {
      inheritCss();
    }
    if (shouldInheritScripts) {
      inheritScripts();
    }

    if (cssUrl && notificationWindow.windowRef) {
      const linkElement = notificationWindow.windowRef
        .getWebWindow()
        .document.createElement("link");
      linkElement.setAttribute("rel", "stylesheet");
      linkElement.setAttribute("href", cssUrl);
      injectNode(linkElement);
    }
  }, [
    notificationWindow.windowRef,
    cssUrl,
    inheritCss,
    inheritScripts,
    injectNode,
  ]);

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

  const launch = useCallback(async () => {
    try {
      dispatchNewState(WINDOW_STATE.LAUNCHING);
      const newNotification = new fin.desktop.Notification({
        ...notificationOptions,
        onShow() {
          if (notificationOptions.onShow) {
            notificationOptions.onShow();
          }
          dispatchNewState(WINDOW_STATE.LAUNCHED);
        },
      });
      setRef(newNotification);
    } catch (error) {
      dispatchError(error);
    }
  }, []);

  const populate = useCallback(
    (jsxElement: JSX.Element) => {
      if (notificationWindow.windowRef) {
        try {
          dispatchNewState(WINDOW_STATE.POPULATING);
          ReactDOM.render(
            jsxElement,
            notificationWindow.windowRef
              .getWebWindow()
              .document.getElementById("root"),
          );
          dispatchNewState(WINDOW_STATE.POPULATED);
        } catch (error) {
          dispatchError(error);
        }
      }
    },
    [notificationWindow.windowRef],
  );

  const close = useCallback(async () => {
    try {
      if (ref) {
        await ref.close();
        dispatch({ type: WINDOW_ACTION.RESET });
        setRef(null);
      }
    } catch (error) {
      throw new Error(error);
    }
  }, [ref]);

  return {
    close,
    launch,
    populate,
    ref,
    state: notificationWindow.state,
    windowRef: notificationWindow.windowRef,
  };
};
