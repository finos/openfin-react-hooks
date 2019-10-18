import { _Window } from "openfin/_v2/api/window/window";
import { WindowOption } from "openfin/_v2/api/window/windowOption";
import { useCallback, useEffect, useReducer } from "react";
import ReactDOM from "react-dom";
import { IUseChildWindowOptions } from "../index";
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

  const injectNode = useCallback(
    (node: HTMLStyleElement | HTMLScriptElement) => {
      if (childWindow.windowRef) {
        childWindow.windowRef
          .getWebWindow()
          .document.getElementsByTagName("head")[0]
          .appendChild(node.cloneNode(true));
      }
    },
    [childWindow.windowRef],
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
    if (shouldInheritCss) {
      inheritCss();
    }
    if (shouldInheritScripts) {
      inheritScripts();
    }

    if (cssUrl && childWindow.windowRef) {
      const linkElement = childWindow.windowRef
        .getWebWindow()
        .document.createElement("link");
      linkElement.setAttribute("rel", "stylesheet");
      linkElement.setAttribute("href", cssUrl);
      injectNode(linkElement);
    }
  }, [
    childWindow.windowRef,
    cssUrl,
    parentDocument,
    inheritCss,
    inheritScripts,
    injectNode,
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
          dispatch({
            payload: await fin.Window.create(options),
            type: WINDOW_ACTION.SET_WINDOW,
          });
          dispatchNewState(WINDOW_STATE.LAUNCHED);
        } catch (error) {
          dispatchError(error);
        }
      }
    },
    [childWindow.state, closeExistingWindow],
  );

  const populate = useCallback(
    (jsxElement: JSX.Element) => {
      if (childWindow.windowRef) {
        try {
          dispatchNewState(WINDOW_STATE.POPULATING);
          ReactDOM.render(
            jsxElement,
            childWindow.windowRef.getWebWindow().document.getElementById("root"),
          );
          dispatchNewState(WINDOW_STATE.POPULATED);
        } catch (error) {
          dispatchError(error);
        }
      }
    },
    [childWindow.windowRef],
  );

  const close = useCallback(async () => {
    try {
      if (childWindow.windowRef) {
        await childWindow.windowRef.close();
        dispatch({ type: WINDOW_ACTION.RESET });
      }
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
