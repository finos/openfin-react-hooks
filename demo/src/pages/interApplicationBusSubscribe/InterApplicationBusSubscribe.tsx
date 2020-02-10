import {useInterApplicationBusSubscribe} from "openfin-react-hooks";
import * as Prism from "prismjs";
import React, {useEffect, useState} from "react";

import styles from "./InterApplicationBusSubscribe.module.css";

const IDENTITY = window.fin ? window.fin.Window.me : null;
const TOPIC = "demo-topic";

let counter = 0;
const sendMessage = () => window.fin.InterApplicationBus.send(IDENTITY, TOPIC, counter++);

const codeExample = `import {useInterApplicationBusSubscribe} from "openfin-react-hooks";

const Component = () => {
    const [numMessages, setNumMessages] = useState(0);
    const onReceiveMessage = () => setNumMessages((currentNumMessages) => currentNumMessages + 1);
    const onFail = (error: unknown) => { throw error; };
    const isSubscribed = useInterApplicationBusSubscribe(IDENTITY, TOPIC, onReceiveMessage, onFail);

    return (
        <div>
            <button type="button" onClick={sendMessage}>Send Message</button>
            <div>{isSubscribed ? "Subscribed" : "Subscribing"} to <strong>demo-topic</strong></div>
            <div>Last received message: {numMessages ? numMessages : "None"}</div>
        </div>
    );
}
`;

const InterApplicationBusSubscribe: React.FC = () => {
    const [numMessages, setNumMessages] = useState(0);
    const onReceiveMessage = () => setNumMessages((currentNumMessages) => currentNumMessages + 1);
    const onFail = (error: unknown) => { throw error; };
    const isSubscribed = useInterApplicationBusSubscribe(IDENTITY, TOPIC, onReceiveMessage, onFail);

    useEffect(Prism.highlightAll, []);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>useInterApplicationBusSubscribe</h1>
            <div className={styles.description}>
                Press the button below to fire messages to the subscribed listener.
            </div>
            <div className={styles.description}>
                This hook automatically unsubscribes whenever your component unmounts.
            </div>
            <h2>Code Example</h2>
            <pre>
                <code className="language-jsx">
                    {codeExample}
                </code>
            </pre>
            <h2>Try it out</h2>
            <button type="button" onClick={sendMessage}>Send Message</button>
            <div className={styles.containerMessage}>
                <div>{isSubscribed ? "Subscribed" : "Subscribing"} to <strong>demo-topic</strong></div>
                <br/>
                <div>Last received message: {numMessages ? numMessages : "None"}</div>
            </div>
        </div>
    );
};

export default InterApplicationBusSubscribe;
