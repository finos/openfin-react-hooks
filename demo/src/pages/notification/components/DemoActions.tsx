import { useNotification } from "openfin-react-hooks";
import React from "react";
import ReactHtmlParser from "react-html-parser";

interface IProps {
  textAreaValue: string;
  NOTIFICATION_HOOK_OPTIONS: any;
}

export default ({ textAreaValue, NOTIFICATION_HOOK_OPTIONS }: IProps) => {
  const notification = useNotification(NOTIFICATION_HOOK_OPTIONS);

  return (
    <>
      <h4>Child Window Actions</h4>
      <button
        onClick={() => notification.launch()}
        disabled={notification.state !== "INITIAL"}
      >
        Launch
      </button>
      <button
        onClick={() =>
          notification.populate(<>{ReactHtmlParser(textAreaValue)}</>)
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
