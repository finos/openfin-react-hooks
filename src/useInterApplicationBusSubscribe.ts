import {Identity} from "openfin/_v2/identity";
import {useEffect, useState} from "react";

export default <T>(
    source: Identity,
    topic: string,
    onReceiveMessage: (message: T, uuid: string, name: string) => void,
    onFail: (error: unknown) => void = (error) => { throw error; },
) => {
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        const fin = window.fin;
        if (isSubscribed || !fin || !fin.InterApplicationBus) {
            return () => null;
        }

        fin.InterApplicationBus.subscribe(source, topic, onReceiveMessage)
            .then(() => setIsSubscribed(true))
            .catch(onFail);

        return () => {
            // Set unsubscribe state before unsubscribing otherwise the component may be unmounted:
            setIsSubscribed(false);
            fin.InterApplicationBus.unsubscribe(source, topic, onReceiveMessage)
                .catch(onFail);
        };
    }, [source.name, source.uuid, topic]);

    return isSubscribed;
};
