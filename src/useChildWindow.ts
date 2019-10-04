import {_Window} from "openfin/_v2/api/window/window";
import { WindowOption } from "openfin/_v2/api/window/windowOption";
import { useCallback, useEffect, useReducer } from "react";
import ReactDOM from "react-dom";
import { IUseChildWindow } from "../index";
import reducer, {
  initialChildWindowState,
} from "./utils/reducers/ChildWindowReducer";
import action from "./utils/types/enums/ChildWindowAction";
import childWindowState from "./utils/types/enums/ChildWindowState";

export default ({name, windowOptions, parentDocument, cssUrl, shouldClosePreviousOnLaunch}: IUseChildWindow) => {
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
    if (parentDocument) {
      const parentStyles = parentDocument.getElementsByTagName("style");
      const parentScripts = parentDocument.getElementsByTagName("script");

      injectNodes(parentStyles);
      injectNodes(parentScripts);
    }
  }, [parentDocument, injectNodes]);

  useEffect(() => {
    if (childWindow.window) {
      if (parentDocument) {
        inheritFromParent();
      }

      if (cssUrl) {
        const linkElement = childWindow.window
        .getWebWindow().document.createElement("link");
        linkElement.setAttribute("rel", "stylesheet");
        linkElement.setAttribute("href", cssUrl);
        injectNode(linkElement);
      }
    }
  }, [childWindow.window, cssUrl, parentDocument, inheritFromParent, injectNode]);

  const closeExistingWindows = useCallback(async () => {
    const application = await fin.Application.getCurrent();
    const childWindows = await application.getChildWindows();

    await Promise.all(
      childWindows.map((win) => (win.identity.name && win.identity.name === name
          ? win.close()
          : Promise.resolve()),
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
    async (newWindowOptions?: WindowOption) => {
      const options = newWindowOptions ? newWindowOptions : windowOptions ? windowOptions : null;
      if (childWindow.state !== childWindowState.launching && options) {
        try {
          dispatchNewState(childWindowState.launching);
          if (shouldClosePreviousOnLaunch) {
            await closeExistingWindows();
          }
          dispatch({
            payload: await fin.Window.create(options),
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
