import { useChannelProvider } from "openfin-react-hooks";
import { Identity } from "openfin/_v2/main";
import * as Prism from "prismjs";
import React, { useEffect, useReducer } from "react";
import uuidv4 from "uuid/v4";
import styles from "./Channel.module.css";

const CHANNEL_NAME = "demo";

const codeExample = `import {useChannelProvider} from "openfin-react-hooks";
  const CHANNEL_NAME = "demo";

  const reducer = (state, action) => {
    switch (action.type) {
      case "increment":
        return {
          count: state.count + 1
        };
      default:
        return state;
    }
  };

  const Component = () => {
      const [state, dispatch] = useReducer(reducer, { count: 0 });
      const channelActions = [
        {
          topic: "increment",
          action: () => dispatch({type: "increment"})
        },
      ];

      const { provider } = useChannelProvider(CHANNEL_NAME, channelActions);
      return (
        <div>
          <button onClick={() => createWindow()}>Connect Client</button>
          <div><strong>Count:</strong> {state.count}</div>
        </div>
      );
  }
  `;

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "increment":
      return {
        ...state,
        count: state.count + 1,
      };
    case "decrement":
      return {
        ...state,
        count: state.count - 1,
      };
    case "close":
      const { childWindows } = state;
      const { windowName } = action.payload;
      if (childWindows[windowName]) {
        childWindows[windowName].close();
        delete childWindows[windowName];
      }
      return state;
    case "setWindow": {
      return {
        ...state,
        childWindows: {
          [action.payload.identity.name]: action.payload,
          ...state.childWindows,
        },
      };
    }
    case "onConnection": {
      const { statuses } = state;
      const { identity } = action.payload;
      return {
        ...state,
        statuses: statuses.concat({
          msg: `Client connected: ${JSON.stringify(identity)}`,
          name: identity.name,
        }),
      };
    }
    case "onDisconnection": {
      const { statuses } = state;
      const { identity } = action.payload;
      return {
        ...state,
        statuses: statuses.filter((x: { name: any }) => x.name !== identity.name),
      };
    }
    case "setPushMessage": {
      return {
        ...state,
        pushMessage: action.payload,
      };
    }
    default:
      return state;
  }
};

const ChannelProvider: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, {
    childWindows: {},
    count: 0,
    statuses: [],
  });

  const channelActions = [
    {
      action: () => dispatch({ type: "increment" }),
      topic: "increment",
    },
    {
      action: () => dispatch({ type: "decrement" }),
      topic: "decrement",
    },
    {
      action: (payload: any) => dispatch({ type: "close", payload }),
      topic: "close",
    },
  ];
  const { provider } = useChannelProvider(CHANNEL_NAME, channelActions);

  useEffect(() => {
    if (provider) {
      provider.onConnection((identity: Identity) => {
        dispatch({ type: "onConnection", payload: { identity } });
      });
      provider.onDisconnection((identity: Identity) => {
        dispatch({ type: "onDisconnection", payload: { identity } });
      });
    }
    Prism.highlightAll();
  }, [provider]);

  const createWindow = async () => {
    const newWindow = await window.fin.Window.create({
      autoShow: true,
      defaultHeight: 420,
      defaultTop: 50 + Object.keys(state.childWindows).length * 20,
      defaultWidth: 680,
      frame: false,
      name: uuidv4(),
      url: "/demo/channel-client",
    });

    dispatch({ type: "setWindow", payload: newWindow });
  };

  const { statuses, pushMessage, childWindows } = state;
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>useChannelProvider</h1>
      <p>
        This hook creates a ChannelProvider for the given channelName and
        registers any actions supplied to it. The actions can then be dispatched
        from the connected ChannelClient using the useChannelClient hook.
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
      <button onClick={() => createWindow()}>Connect Client</button>
      <div className={styles.input}>
        <strong>Provider Status:</strong>
      </div>
      {statuses.map((value: any, key: string) => {
        return (
          <div key={key}>
            <code className="providerStatus language-json">{value.msg}</code>
          </div>
        );
      })}
      <div className={styles.input}>
        <strong>Count:</strong> <span>{state.count}</span>
      </div>
      <h4>Send a message to client(s)</h4>
      <input
        placeholder="Type your message"
        type="text"
        onChange={(e) =>
          dispatch({ type: "setPushMessage", payload: e.target.value })
        }
      />{" "}
      <button
        onClick={() => provider.publish("pushMessage", pushMessage)}
        disabled={Object.keys(childWindows).length === 0}
      >
        Push
      </button>
    </div>
  );
};

export default ChannelProvider;
