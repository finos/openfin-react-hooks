import {Identity} from "openfin/_v2/identity";

export default <T>(destination: Identity, topic: string) => {
    const sendMessage = (message: T) => {
        const fin = window.fin;
        if (!fin || !fin.InterApplicationBus) {
            throw new Error(`fin is undefined. This hook can only be run in an OpenFin container.`);
        }

        return fin.InterApplicationBus.send(destination, topic, message);
    };

    return sendMessage;
};
