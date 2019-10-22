import { IUseNotificationOptions, useNotification } from "openfin-react-hooks";
import React from "react";
import ReactHtmlParser from "react-html-parser";

interface IProps {
    textAreaValue: string;
    NOTIFICATION_HOOK_OPTIONS: IUseNotificationOptions;
    notificationOptions?: fin.NotificationOptions;
}

export default ({
    textAreaValue,
    NOTIFICATION_HOOK_OPTIONS,
    notificationOptions,
}: IProps) => {
    const notification = useNotification(NOTIFICATION_HOOK_OPTIONS);

    return (
        <>
            <h4>Notification Actions</h4>
            <button
                onClick={() => notification.launch(notificationOptions)}
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
