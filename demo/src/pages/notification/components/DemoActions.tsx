import { useNotification } from "openfin-react-hooks";
import React from "react";
// import ReactHtmlParser from "react-html-parser";

// interface IProps {
//   textAreaValue: string;
// }
const DEFAULT_NOTIFICATION_BODY = <h4>Hello World!</h4>;

const notificationOptions: any = {
  message: null,
  timeout: "never",
  url: process.env.REACT_APP_SAMPLE_WINDOW_HTML,
};

export default () => {
  const notification = useNotification({
    notificationOptions,
  });
  return (
    <>
      <h4>Child Window Actions</h4>
      <button onClick={() => notification.launch()}>Launch</button>
      <button
        onClick={() =>
          notification.populate(
            // textAreaValue ? (
            //   <>{ReactHtmlParser(textAreaValue)}</>
            // ) : (
            DEFAULT_NOTIFICATION_BODY,
            // )
          )
        }
        disabled={!notification.ref}
      >
        Populate
      </button>
      <button onClick={() => notification.close()} disabled={!notification.ref}>
        Close
      </button>
    </>
  );
};
