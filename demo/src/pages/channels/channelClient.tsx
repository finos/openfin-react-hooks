import { useChannelClient } from "openfin-react-hooks";
import * as Prism from "prismjs";
import React, { useEffect, useState } from "react";
import styles from "./Channel.module.css";

const CHANNEL_NAME = "demo";

const codeExample = `import {useChannelClient} from "openfin-react-hooks";
  const CHANNEL_NAME = "demo";

  const Component = () => {
      const { client } = useChannelClient(CHANNEL_NAME);

      useEffect(() => {
        // register for push messages from the ChannelProvider
        if (client) {
          client.register("pushMessage", (payload) => setPushMessage(payload));
        }
      }, [client]);

      return (
        <div>
          <button onClick={async () => await client.dispatch("increment")}>Increment</button>
        </div>
      );
  }
  `;

const ChannelClient: React.FC = () => {
  const [pushMsg, setPushMessage] = useState();
  const { client } = useChannelClient(CHANNEL_NAME);

  useEffect(() => {
    if (client) {
      client.register("pushMessage", (payload: any) => setPushMessage(payload));
    }
    Prism.highlightAll();
  }, [client]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>useChannelClient</h1>
      <p>
        Each of the buttons below dispatches an action from the client over the
        Channels api to the provider. Notice the count on the channelProvider
        update!
      </p>
      <div className={styles.description}>
        <i>
          This hook automatically unsubscribes whenever your component unmounts.
        </i>
      </div>
      <h2>Code Example</h2>
      <pre>
        <code className="language-jsx">{codeExample}</code>
      </pre>
      <h2>Try it out</h2>
      <button onClick={async () => await client.dispatch("increment")}>
        Increment
      </button>{" "}
      <button onClick={async () => await client.dispatch("decrement")}>
        Decrement
      </button>{" "}
      <button
        onClick={async () =>
          await client.dispatch("close", {
            windowName: window.fin.Window.getCurrentSync().identity.name,
          })
        }
      >
        Close
      </button>
      {pushMsg ? (
        <div className={styles.input}>
          <strong>Push Received:</strong> <span>{pushMsg}</span>
        </div>
      ) : null}
    </div>
  );
};

export default ChannelClient;
