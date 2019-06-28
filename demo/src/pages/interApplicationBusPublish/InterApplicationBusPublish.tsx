import {useInterApplicationBusPublish, useInterApplicationBusSubscribe} from "openfin-react-hooks";
import * as Prism from "prismjs";
import React, {useEffect, useState} from "react";

import styles from "./InterApplicationBusPublish.module.css";

const TOPIC = "demo-topic";

const codeExample = `import {useInterApplicationBusPublish, useInterApplicationBusSubscribe} from "openfin-react-hooks";

const TOPIC = "demo-topic";

const Component = () => {
    const [name, setName] = useState("John Smith");
    const {data} = useInterApplicationBusSubscribe({ uuid: "*" }, TOPIC);
    useInterApplicationBusPublish(TOPIC, name);

    return (
        <div>
            <input type="text" onChange={(e) => setName(e.target.value)} value={name} />
            <div><strong>Received Message:</strong> {data ? data.message : "None"}</div>
        </div>
    )
}
`;

const InterApplicationBusPublish: React.FC = () => {
    const [name, setName] = useState("John Smith");
    const {data} = useInterApplicationBusSubscribe({ uuid: "*" }, TOPIC);

    useInterApplicationBusPublish(TOPIC, name);
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
            <input placeholder="Enter a name" type="text" onChange={(e) => setName(e.target.value)} value={name}/>
            <div className={styles.input}><strong>Received Message:</strong> {data ? data.message : "None"}</div>
        </div>
    );
};

export default InterApplicationBusPublish;
