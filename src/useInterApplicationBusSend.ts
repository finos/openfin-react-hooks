import {Identity} from "openfin/_v2/identity";
import {useMemo} from "react";

export default <T>(destination: Identity, topic: string) => {
    return useMemo(() => {
        const sendMessage = (message: T) => {
            const fin = window.fin;
            if (!fin || !fin.InterApplicationBus) {
                throw new Error(`fin is undefined. This hook can only be run in an OpenFin container.`);
            }

            return fin.InterApplicationBus.send(destination, topic, message);
        };

        return sendMessage;
    }, [destination, topic]);
};
