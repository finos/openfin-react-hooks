import {useInterApplicationBusSend, useInterApplicationBusSubscribe} from "openfin-react-hooks";
import * as Prism from "prismjs";
import React, {useEffect, useState} from "react";

import styles from "./InterApplicationBusSend.module.css";

const IDENTITY = window.fin ? window.fin.Window.me : null;
const TOPIC = "demo-topic";

const codeExample = `import {useInterApplicationBusSend, useInterApplicationBusSubscribe} from "openfin-react-hooks";

const IDENTITY = window.fin ? window.fin.Window.me : null;
const TOPIC = "demo-topic";

const formatNames = (names: string[]) => {
    return ["["].concat(names.join(", ").concat("]"));
}

const Component = () => {
    const [receivedNames, setReceivedNames] = useState<string[]>([]);
    const [nameToSend, setNameToSend] = useState("John Smith");
    const onReceiveMessage = (message: string) => setReceivedNames((allData) => [message].concat(allData));
    const onFail = (error: unknown) => { throw error; };
    useInterApplicationBusSubscribe(IDENTITY, TOPIC, onReceiveMessage, onFail);

    const sendMessage = useInterApplicationBusSend(IDENTITY, TOPIC);

    return (
        <div>
            <form onSubmit={(e) => { sendMessage(nameToSend); e.preventDefault(); }}>
                <input
                    placeholder="Enter a name"
                    type="text"
                    onChange={(e) => setNameToSend(e.target.value)}
                    value={nameToSend}
                />
                <button type="submit">Submit</button>
            </form>
            <div>
                <strong>Received Messages:</strong> {receivedNames ? formatNames(receivedNames) : "None"}
            </div>
        </div>
    )
}
`;

const formatNames = (names: string[]) => {
    return ["["].concat(names.join(", ").concat("]"));
};

const InterApplicationBusSend: React.FC = () => {
    const [receivedNames, setReceivedNames] = useState<string[]>([]);
    const [nameToSend, setNameToSend] = useState("John Smith");
    const onReceiveMessage = (message: string) => setReceivedNames((allData) => [message].concat(allData));
    const onFail = (error: unknown) => { throw error; };
    useInterApplicationBusSubscribe(IDENTITY, TOPIC, onReceiveMessage, onFail);

    const sendMessage = useInterApplicationBusSend(IDENTITY, TOPIC);
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
            <form onSubmit={(e) => { sendMessage(nameToSend); e.preventDefault(); }}>
                <input
                    placeholder="Enter a name"
                    type="text"
                    onChange={(e) => setNameToSend(e.target.value)}
                    value={nameToSend}
                    className={styles.formChild}
                />
                <button type="submit" className={styles.formChild}>Submit</button>
            </form>
            <div className={styles.input}>
                <strong>Received Messages:</strong> {receivedNames ? formatNames(receivedNames) : "None"}
            </div>
        </div>
    );
};

export default InterApplicationBusSend;
