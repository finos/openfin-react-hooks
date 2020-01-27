import {useInterApplicationBusSend, useInterApplicationBusSubscribe} from "openfin-react-hooks";
import * as Prism from "prismjs";
import React, {useEffect, useState} from "react";

import styles from "./InterApplicationBusSend.module.css";

const IDENTITY = window.fin ? window.fin.Window.me : null;
const TOPIC = "demo-topic";

const codeExample = `import {useInterApplicationBusSend, useInterApplicationBusSubscribe} from "openfin-react-hooks";

const IDENTITY = window.fin.Window.me;
const TOPIC = "demo-topic";

const Component = () => {
    const [receivedName, setReceivedName] = useState("");
    const [sentName, setSentName] = useState("John Smith");
    const onReceiveMessage = (message: string) => setReceivedName(message);
    const onFail = (error: unknown) => { throw error };
    useInterApplicationBusSubscribe(IDENTITY, TOPIC, onReceiveMessage, onFail);

    useInterApplicationBusSend(IDENTITY, TOPIC, sentName);

    return (
        <div>
            <input
                placeholder="Enter a name"
                type="text"
                onChange={(e) => setSentName(e.target.value)}
                value={sentName}
            />
            <div className={styles.input}>
                <strong>Received Message:</strong> {receivedName ? receivedName : "None"}
            </div>
        </div>
    )
}
`;

const InterApplicationBusSend: React.FC = () => {
    const [receivedName, setReceivedName] = useState("");
    const [sentName, setSentName] = useState("John Smith");
    const onReceiveMessage = (message: string) => setReceivedName(message);
    const onFail = (error: unknown) => { throw error; };
    useInterApplicationBusSubscribe(IDENTITY, TOPIC, onReceiveMessage, onFail);

    useInterApplicationBusSend(IDENTITY, TOPIC, sentName);
    useEffect(Prism.highlightAll, []);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>useInterApplicationBusSend</h1>
            <div className={styles.description}>
                Try editing the input below to send a message down the InterApplicationBus whenever it changes value.
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
            <input
                placeholder="Enter a name"
                type="text"
                onChange={(e) => setSentName(e.target.value)}
                value={sentName}
            />
            <div className={styles.input}>
                <strong>Received Message:</strong> {receivedName ? receivedName : "None"}
            </div>
        </div>
    );
};

export default InterApplicationBusSend;
