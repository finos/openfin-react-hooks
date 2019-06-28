import {useInterApplicationBusSend, useInterApplicationBusSubscribe} from "openfin-react-hooks";
import * as Prism from "prismjs";
import React, {useEffect, useState} from "react";

import styles from "./InterApplicationBusSend.module.css";

const IDENTITY = window.fin.Window.me;
const TOPIC = "demo-topic";

const codeExample = `import {useInterApplicationBusSend, useInterApplicationBusSubscribe} from "openfin-react-hooks";

const IDENTITY = window.fin.Window.me;
const TOPIC = "demo-topic";

const Component = () => {
    const [name, setName] = useState("John Smith");
    const { data } = useInterApplicationBusSubscribe(IDENTITY, TOPIC);
    useInterApplicationBusSend(IDENTITY, TOPIC, name);

    return (
        <div>
            <input type="text" onChange={(e) => setName(e.target.value)} value={name} />
            <div><strong>Received Message:</strong> {data ? data.message : "None"}</div>
        </div>
    )
}
`;

const InterApplicationBusSend: React.FC = () => {
    const [name, setName] = useState("John Smith");
    const {data} = useInterApplicationBusSubscribe(IDENTITY, TOPIC);

    useInterApplicationBusSend(IDENTITY, TOPIC, name);
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
            <input placeholder="Enter a name" type="text" onChange={(e) => setName(e.target.value)} value={name} />
            <div className={styles.input}><strong>Received Message:</strong> {data ? data.message : "None"}</div>
        </div>
    );
};

export default InterApplicationBusSend;
