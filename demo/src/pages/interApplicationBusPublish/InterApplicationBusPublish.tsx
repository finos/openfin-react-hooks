import {useInterApplicationBusPublish, useInterApplicationBusSubscribe} from "openfin-react-hooks";
import * as Prism from "prismjs";
import React, {useEffect, useState} from "react";

import styles from "./InterApplicationBusPublish.module.css";

const TOPIC = "demo-topic";

const codeExample = `import {useInterApplicationBusPublish, useInterApplicationBusSubscribe} from "openfin-react-hooks";

const TOPIC = "demo-topic";

const formatNames = (names: string[]) => {
    return ["["].concat(names.join(", ").concat("]"));
};

const Component = () => {
    const [receivedNames, setReceivedNames] = useState([] as string[]);
    const [nameToPublish, setNameToPublish] = useState("John Smith");
    const onReceiveMessage = (message: string) => setReceivedNames((names) => [message].concat(names));
    const onFail = (error: unknown) => { throw error; };
    useInterApplicationBusSubscribe({uuid: "*"}, TOPIC, onReceiveMessage, onFail);

    const publishMessage = useInterApplicationBusPublish(TOPIC);

    return (
        <div>
            <form onSubmit={(e) => { publishMessage(nameToPublish); e.preventDefault(); }}>
                <input
                    placeholder="Enter a name"
                    type="text"
                    onChange={(e) => setNameToPublish(e.target.value)}
                    value={nameToPublish}
                    className={styles.formChild}
                />
                <button type="submit" className={styles.formChild}>Submit</button>
            </form>
            <div className={styles.input}>
                <strong>Received Messages:</strong> {receivedNames ? formatNames(receivedNames) : "None"}
            </div>
        </div>
    )
}
`;

const formatNames = (names: string[]) => {
    return ["["].concat(names.join(", ").concat("]"));
};

const InterApplicationBusPublish: React.FC = () => {
    const [receivedNames, setReceivedNames] = useState([] as string[]);
    const [nameToPublish, setNameToPublish] = useState("John Smith");
    const onReceiveMessage = (message: string) => setReceivedNames((names) => [message].concat(names));
    const onFail = (error: unknown) => { throw error; };
    useInterApplicationBusSubscribe({uuid: "*"}, TOPIC, onReceiveMessage, onFail);

    const publishMessage = useInterApplicationBusPublish(TOPIC);
    useEffect(Prism.highlightAll, []);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>useInterApplicationBusPublish</h1>
            <div className={styles.description}>
                Try editing the input below to publish a message down the InterApplicationBus whenever it changes value.
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
            <form onSubmit={(e) => { publishMessage(nameToPublish); e.preventDefault(); }}>
                <input
                    placeholder="Enter a name"
                    type="text"
                    onChange={(e) => setNameToPublish(e.target.value)}
                    value={nameToPublish}
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

export default InterApplicationBusPublish;
