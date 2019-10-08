import {_Window} from "openfin/_v2/api/window/window";
import { WindowOption } from "openfin/_v2/api/window/windowOption";
import { ReactElement, useCallback, useEffect, useReducer } from "react";
import ReactDOM from "react-dom";
import { IUseChildWindow } from "../index";
import reducer, {
  INITIAL_CHILD_WINDOW_STATE,
} from "./utils/reducers/ChildWindowReducer";
import ACTION from "./utils/types/enums/ChildWindowAction";
import CHILD_WINDOW_STATE from "./utils/types/enums/ChildWindowState";

export default ({
  name,
  windowOptions,
  parentDocument,
  cssUrl,
  shouldClosePreviousOnLaunch,
  shouldInheritCSS,
  shouldInheritScripts,
}: IUseChildWindow) => {
  const [childWindow, dispatch] = useReducer(reducer, INITIAL_CHILD_WINDOW_STATE);

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
      if (shouldInheritCSS) {
        const parentStyles = parentDocument.getElementsByTagName("style");
        injectNodes(parentStyles);
      }
      if (shouldInheritScripts) {
        const parentScripts = parentDocument.getElementsByTagName("script");
        injectNodes(parentScripts);
      }
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
      payload: CHILD_WINDOW_STATE.ERROR,
      type: ACTION.CHANGE_STATE,
    });
  };

  const dispatchNewState = (state: CHILD_WINDOW_STATE) =>
    dispatch({
      payload: state,
      type: ACTION.CHANGE_STATE,
    });

  const launch = useCallback(
    async (newWindowOptions?: WindowOption) => {
      const options = newWindowOptions ? newWindowOptions : windowOptions ? windowOptions : null;
      if (childWindow.state !== CHILD_WINDOW_STATE.LAUNCHING && options) {
        try {
          dispatchNewState(CHILD_WINDOW_STATE.LAUNCHING);
          if (shouldClosePreviousOnLaunch) {
            await closeExistingWindows();
          }
          dispatch({
            payload: await fin.Window.create(options),
            type: ACTION.SET_WINDOW,
          });
          dispatchNewState(CHILD_WINDOW_STATE.LAUNCHING);
        } catch (error) {
          dispatchError(error);
        }
      }
    },
    [childWindow.state, closeExistingWindows],
  );

  const populate = useCallback(
    (jsx: ReactElement[]) => {
      if (childWindow.window) {
        try {
          dispatchNewState(CHILD_WINDOW_STATE.POPULATING);
          ReactDOM.render(
            jsx,
            childWindow.window.getWebWindow().document.getElementById("root"),
          );
          dispatchNewState(CHILD_WINDOW_STATE.POPULATED);
        } catch (error) {
          dispatchError(error);
        }
      }
    },
    [childWindow.window],
  );

  const close = useCallback(async () => {
    try {
      if (childWindow.window) {
        await childWindow.window.close();
        dispatch({ type: ACTION.RESET });
      }
    } catch (error) {
      dispatchError(error);
    }
  }, [childWindow.window]);

  return {
    close,
    launch,
    populate,
    state: childWindow.state,
    window: childWindow.window,
  };
};
