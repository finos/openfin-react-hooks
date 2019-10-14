import { useCallback, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { IUseNotificationOptions } from "../index";

export default ({
  parentDocument,
  cssUrl,
  htmlUrl,
  jsx,
  shouldInheritCss,
  shouldInheritScripts,
}: IUseNotificationOptions) => {
  const [notificationRef, setNotificationRef] = useState<any>(null);

  const injectNode = useCallback(
    (node: HTMLStyleElement | HTMLScriptElement) => {
      if (notificationRef) {
        notificationRef
          .getWebWindow()
          .document.getElementsByTagName("head")[0]
          .appendChild(node.cloneNode(true));
      }
    },
    [notificationRef],
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
    if (jsx) {
      populate(jsx);
    }
  }, [notificationRef]);

  useEffect(() => {
    if (shouldInheritCss) {
      inheritCss();
    }
    if (shouldInheritScripts) {
      inheritScripts();
    }

    if (cssUrl && notificationRef) {
      const linkElement = notificationRef
        .getWebWindow()
        .document.createElement("link");
      linkElement.setAttribute("rel", "stylesheet");
      linkElement.setAttribute("href", cssUrl);
      injectNode(linkElement);
    }
  }, [
    notificationRef,
    cssUrl,
    parentDocument,
    inheritCss,
    inheritScripts,
    injectNode,
  ]);

  const launch = useCallback(async (message?: string) => {
    const newNotification = await new fin.desktop.Notification({
      message: message ? message : null,
      url: htmlUrl,
    });
    setNotificationRef(newNotification);
  }, []);

  const populate = useCallback(
    (jsxElement: JSX.Element) => {
      if (notificationRef) {
        try {
          ReactDOM.render(
            jsxElement,
            notificationRef.getWebWindow().document.getElementById("root"),
          );
        } catch (error) {
            throw new Error(error);
        }
      }
    },
    [notificationRef],
  );

  const close = useCallback(async () => {
    try {
      if (notificationRef) {
        await notificationRef.close();
      }
    } catch (error) {
        throw new Error(error);
    }
  }, [notificationRef]);

  return {
    close,
    launch,
    notificationRef,
    populate,
  };
};
