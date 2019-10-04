import {_Window} from "openfin/_v2/api/window/window";
import { WindowOption } from "openfin/_v2/api/window/windowOption";
import { useCallback, useEffect, useReducer } from "react";
import ReactDOM from "react-dom";
import reducer, {
  initialChildWindowState,
} from "./utils/reducers/ChildWindowReducer";
import action from "./utils/types/enums/ChildWindowAction";
import childWindowState from "./utils/types/enums/ChildWindowState";

export default (name: string, document: HTMLDocument, cssUrl: string) => {
  const [childWindow, dispatch] = useReducer(reducer, initialChildWindowState);

  const injectNode = useCallback(
    (node: HTMLStyleElement | HTMLScriptElement) => {
      if (childWindow.window) {
        childWindow.window
          .getWebWindow()
          .document.getElementsByTagName("head")[0]
          .appendChild(node.cloneNode(true));
      }
    },
    [childWindow.window],
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

  const inheritFromParent = useCallback(() => {
    const parentStyles = document.getElementsByTagName("style");
    const parentScripts = document.getElementsByTagName("script");

    injectNodes(parentStyles);
    injectNodes(parentScripts);
  }, [document, injectNodes]);

  useEffect(() => {
    if (childWindow.window) {
      if (document) {
        inheritFromParent();
      }

      if (cssUrl) {
        const linkElement = document.createElement("link");
        linkElement.setAttribute("rel", "stylesheet");
        linkElement.setAttribute("href", cssUrl);
        injectNode(linkElement);
      }
    }
  }, [childWindow.window, cssUrl, document, inheritFromParent, injectNode]);

  const closeExistingWindows = useCallback(async () => {
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
      payload: childWindowState.error,
      type: action.changeState,
    });
  };

  const dispatchNewState = (state: childWindowState) =>
    dispatch({
      payload: state,
      type: action.changeState,
    });

  const launch = useCallback(
    async (windowOptions: WindowOption) => {
      if (childWindow.state !== childWindowState.launching) {
        try {
          dispatchNewState(childWindowState.launching);
          await closeExistingWindows();
          dispatch({
            payload: await fin.Window.create(windowOptions),
            type: action.setWindow,
          });
          dispatchNewState(childWindowState.launched);
        } catch (error) {
          dispatchError(error);
        }
      }
    },
    [childWindow.state, closeExistingWindows],
  );

  const populateDOM = useCallback(
    (jsx: JSX.Element) => {
      if (childWindow.window) {
        try {
          dispatchNewState(childWindowState.populating);
          ReactDOM.render(
            jsx,
            childWindow.window.getWebWindow().document.getElementById("root"),
          );
          dispatchNewState(childWindowState.populated);
        } catch (error) {
          dispatchError(error);
        }
      }
    },
    [childWindow.window],
  );

  const close = useCallback(() => {
    try {
      if (childWindow.window) {
        childWindow.window.close();
        dispatch({ type: action.reset });
      }
    } catch (error) {
      dispatchError(error);
    }
  }, [childWindow.window]);

  return {
    close,
    launch,
    populateDOM,
    state: childWindow.state,
    window: childWindow.window,
  };
};
